const client = require("../prismaClient");

class mesaController {

  static async cadastrar(req, res) {
    const { codigo, n_lugares, status } = req.body;

    if (!codigo || !n_lugares) {
      return res.status(400).json({
        mensagem: "Código e número de lugares são obrigatórios.",
        erro: true,
      });
    }

    const lugares = parseInt(n_lugares);
    if (isNaN(lugares) || lugares < 1) {
      return res.status(400).json({
        mensagem: "Número de lugares deve ser um inteiro positivo.",
        erro: true,
      });
    }

    const statusValidos = ["disponível", "reservada", "inativa"];
    const statusFinal = status || "disponível";
    if (!statusValidos.includes(statusFinal)) {
      return res.status(400).json({
        mensagem: "Status inválido. Use: disponível, reservada ou inativa.",
        erro: true,
      });
    }

    try {
      const mesa = await client.mesa.create({
        data: {
          codigo: codigo.trim(),
          n_lugares: lugares,
          status: statusFinal,
        },
      });

      return res.status(201).json({
        mensagem: "Mesa cadastrada com sucesso!",
        erro: false,
        mesa,
      });
    } catch (err) {
      if (err.code === "P2002") {
        return res.status(409).json({
          mensagem: "Já existe uma mesa com esse código.",
          erro: true,
        });
      }
      console.error("Erro ao cadastrar mesa:", err);
      return res.status(500).json({
        mensagem: "Falha ao criar mesa.",
        erro: true,
      });
    }
  }

  static async buscarMesas(req, res) {
    try {
      const mesas = await client.mesa.findMany({
        orderBy: { codigo: "asc" },
      });
      return res.json({
        mensagem: "Mesas encontradas com sucesso!",
        erro: false,
        mesas,
      });
    } catch (err) {
      console.error("Erro ao buscar mesas:", err);
      return res.status(500).json({
        mensagem: "Falha ao buscar mesas.",
        erro: true,
      });
    }
  }

  static async buscarMesa(req, res) {
    const mesaId = parseInt(req.params.id);
    if (isNaN(mesaId)) {
      return res.status(400).json({ mensagem: "ID inválido.", erro: true });
    }

    try {
      const mesa = await client.mesa.findUnique({
        where: { id: mesaId },
        include: {
          reservas: {
            where: { status: true },
            select: {
              id: true,
              data: true,
              n_pessoas: true,
              usuario: { select: { id: true, nome: true, sobrenome: true, email: true } },
            },
          },
        },
      });

      if (!mesa) {
        return res.status(404).json({
          mensagem: "Mesa não encontrada.",
          erro: true,
        });
      }

      return res.json({
        mensagem: "Mesa encontrada com sucesso!",
        erro: false,
        mesa,
      });
    } catch (err) {
      console.error("Erro ao buscar mesa:", err);
      return res.status(500).json({
        mensagem: "Falha ao buscar mesa.",
        erro: true,
      });
    }
  }

  /**
   * Atualiza uma mesa.
   *
   * Quando a transição for reservada → disponível (liberação administrativa):
   *   - Cancela (soft-delete: status=false) todas as reservas ativas da mesa
   *   - Libera a mesa
   *   - Tudo em uma única transação atômica para garantir consistência
   *
   * A mesa, o usuário e o histórico de reservas são PRESERVADOS.
   */
  static async atualizar(req, res) {
    const mesaId = parseInt(req.params.id);
    if (isNaN(mesaId)) {
      return res.status(400).json({ mensagem: "ID inválido.", erro: true });
    }

    const { codigo, n_lugares, status } = req.body;

    if (!codigo || !n_lugares || !status) {
      return res.status(400).json({
        mensagem: "Código, número de lugares e status são obrigatórios.",
        erro: true,
      });
    }

    const lugares = parseInt(n_lugares);
    if (isNaN(lugares) || lugares < 1) {
      return res.status(400).json({
        mensagem: "Número de lugares deve ser um inteiro positivo.",
        erro: true,
      });
    }

    const statusValidos = ["disponível", "reservada", "inativa"];
    if (!statusValidos.includes(status)) {
      return res.status(400).json({
        mensagem: "Status inválido. Use: disponível, reservada ou inativa.",
        erro: true,
      });
    }

    try {
      // Usa $transaction para garantir atomicidade:
      // findUnique + updateMany (se liberando) + update da mesa
      const result = await client.$transaction(async (tx) => {
        const mesaAtual = await tx.mesa.findUnique({
          where: { id: mesaId },
        });

        if (!mesaAtual) return { notFound: true };

        const liberandoMesa =
          mesaAtual.status === "reservada" && status === "disponível";

        let reservasCanceladas = 0;

        if (liberandoMesa) {
          // CORREÇÃO CRÍTICA: updateMany em vez de deleteMany
          // Preserva o histórico, apenas marca as reservas ativas como canceladas
          const updated = await tx.reserva.updateMany({
            where: {
              mesa_id: mesaId,
              status: true,
            },
            data: {
              status: false,
            },
          });
          reservasCanceladas = updated.count;
        }

        const mesa = await tx.mesa.update({
          where: { id: mesaId },
          data: {
            codigo: codigo.trim(),
            n_lugares: lugares,
            status,
          },
        });

        return { mesa, liberandoMesa, reservasCanceladas };
      });

      if (result.notFound) {
        return res.status(404).json({
          mensagem: "Mesa não encontrada.",
          erro: true,
        });
      }

      let mensagem = "Mesa atualizada com sucesso!";
      if (result.liberandoMesa) {
        mensagem =
          result.reservasCanceladas > 0
            ? `Mesa liberada! ${result.reservasCanceladas} reserva(s) ativa(s) cancelada(s). Histórico preservado.`
            : "Mesa liberada com sucesso! Nenhuma reserva ativa encontrada.";
      }

      return res.json({
        mensagem,
        erro: false,
        mesa: result.mesa,
      });
    } catch (err) {
      if (err.code === "P2002") {
        return res.status(409).json({
          mensagem: "Já existe uma mesa com esse código.",
          erro: true,
        });
      }
      console.error("Erro ao atualizar mesa:", err);
      return res.status(500).json({
        mensagem: "Falha ao atualizar mesa.",
        erro: true,
      });
    }
  }

  /**
   * Remove uma mesa.
   * Se existirem reservas (ativas ou históricas) vinculadas, recusa a remoção
   * para preservar integridade referencial (FK ON DELETE RESTRICT).
   * Admin pode forçar remoção apenas de mesas sem histórico algum.
   */
  static async remover(req, res) {
    const mesaId = parseInt(req.params.id);
    if (isNaN(mesaId)) {
      return res.status(400).json({ mensagem: "ID inválido.", erro: true });
    }

    try {
      const mesa = await client.mesa.findUnique({
        where: { id: mesaId },
        include: { _count: { select: { reservas: true } } },
      });

      if (!mesa) {
        return res.status(404).json({
          mensagem: "Mesa não encontrada.",
          erro: true,
        });
      }

      if (mesa._count.reservas > 0) {
        return res.status(409).json({
          mensagem:
            "Não é possível remover uma mesa com reservas vinculadas. Marque a mesa como 'inativa' para desativá-la sem perder o histórico.",
          erro: true,
        });
      }

      await client.mesa.delete({
        where: { id: mesaId },
      });

      return res.json({
        mensagem: "Mesa removida com sucesso!",
        erro: false,
      });
    } catch (err) {
      console.error("Erro ao remover mesa:", err);
      return res.status(500).json({
        mensagem: "Falha ao remover mesa.",
        erro: true,
      });
    }
  }
}

module.exports = mesaController;
