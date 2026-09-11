const client = require("../prismaClient");

const STATUS_VALIDOS = ["disponível", "reservada", "inativa"];

async function cadastrar(req, res) {
  const { codigo, n_lugares, status } = req.body;

  if (!codigo || !n_lugares) {
    return res.status(400).json({ mensagem: "Código e número de lugares são obrigatórios.", erro: true });
  }

  const lugares = parseInt(n_lugares);
  if (isNaN(lugares) || lugares < 1) {
    return res.status(400).json({ mensagem: "Número de lugares deve ser um inteiro positivo.", erro: true });
  }

  const statusFinal = status || "disponível";
  if (!STATUS_VALIDOS.includes(statusFinal)) {
    return res.status(400).json({ mensagem: "Status inválido. Use: disponível, reservada ou inativa.", erro: true });
  }

  try {
    const mesa = await client.mesa.create({
      data: { codigo: codigo.trim(), n_lugares: lugares, status: statusFinal },
    });
    return res.status(201).json({ mensagem: "Mesa cadastrada com sucesso!", erro: false, mesa });
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(409).json({ mensagem: "Já existe uma mesa com esse código.", erro: true });
    }
    console.error("Erro ao cadastrar mesa:", err);
    return res.status(500).json({ mensagem: "Falha ao criar mesa.", erro: true });
  }
}

async function buscarMesas(req, res) {
  try {
    const mesas = await client.mesa.findMany({ orderBy: { codigo: "asc" } });
    return res.json({ mensagem: "Mesas encontradas com sucesso!", erro: false, mesas });
  } catch (err) {
    console.error("Erro ao buscar mesas:", err);
    return res.status(500).json({ mensagem: "Falha ao buscar mesas.", erro: true });
  }
}

async function buscarMesa(req, res) {
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
      return res.status(404).json({ mensagem: "Mesa não encontrada.", erro: true });
    }
    return res.json({ mensagem: "Mesa encontrada com sucesso!", erro: false, mesa });
  } catch (err) {
    console.error("Erro ao buscar mesa:", err);
    return res.status(500).json({ mensagem: "Falha ao buscar mesa.", erro: true });
  }
}

async function atualizar(req, res) {
  const mesaId = parseInt(req.params.id);
  if (isNaN(mesaId)) {
    return res.status(400).json({ mensagem: "ID inválido.", erro: true });
  }

  const { codigo, n_lugares, status } = req.body;

  if (!codigo || !n_lugares || !status) {
    return res.status(400).json({ mensagem: "Código, número de lugares e status são obrigatórios.", erro: true });
  }

  const lugares = parseInt(n_lugares);
  if (isNaN(lugares) || lugares < 1) {
    return res.status(400).json({ mensagem: "Número de lugares deve ser um inteiro positivo.", erro: true });
  }

  if (!STATUS_VALIDOS.includes(status)) {
    return res.status(400).json({ mensagem: "Status inválido. Use: disponível, reservada ou inativa.", erro: true });
  }

  try {
    const result = await client.$transaction(async (tx) => {
      const mesaAtual = await tx.mesa.findUnique({ where: { id: mesaId } });
      if (!mesaAtual) return { notFound: true };

      const liberandoMesa = mesaAtual.status === "reservada" && status === "disponível";
      let reservasCanceladas = 0;

      if (liberandoMesa) {
        const updated = await tx.reserva.updateMany({
          where: { mesa_id: mesaId, status: true },
          data: { status: false },
        });
        reservasCanceladas = updated.count;
      }

      const mesa = await tx.mesa.update({
        where: { id: mesaId },
        data: { codigo: codigo.trim(), n_lugares: lugares, status },
      });

      return { mesa, liberandoMesa, reservasCanceladas };
    });

    if (result.notFound) {
      return res.status(404).json({ mensagem: "Mesa não encontrada.", erro: true });
    }

    let mensagem = "Mesa atualizada com sucesso!";
    if (result.liberandoMesa) {
      mensagem = result.reservasCanceladas > 0
        ? `Mesa liberada! ${result.reservasCanceladas} reserva(s) ativa(s) cancelada(s).`
        : "Mesa liberada com sucesso!";
    }

    return res.json({ mensagem, erro: false, mesa: result.mesa });
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(409).json({ mensagem: "Já existe uma mesa com esse código.", erro: true });
    }
    console.error("Erro ao atualizar mesa:", err);
    return res.status(500).json({ mensagem: "Falha ao atualizar mesa.", erro: true });
  }
}

async function remover(req, res) {
  const mesaId = parseInt(req.params.id);
  if (isNaN(mesaId)) {
    return res.status(400).json({ mensagem: "ID inválido.", erro: true });
  }

  try {
    const mesa = await client.mesa.findUnique({
      where: { id: mesaId },
      include: {
        _count: {
          select: {
            reservas: { where: { status: true } },
          },
        },
      },
    });

    if (!mesa) {
      return res.status(404).json({ mensagem: "Mesa não encontrada.", erro: true });
    }

    if (mesa._count.reservas > 0) {
      return res.status(409).json({
        mensagem: "Não é possível remover uma mesa com reserva ativa. Cancele a reserva antes de remover a mesa.",
        erro: true,
      });
    }

    await client.$transaction(async (tx) => {
      await tx.reserva.deleteMany({ where: { mesa_id: mesaId } });
      await tx.mesa.delete({ where: { id: mesaId } });
    });

    return res.json({ mensagem: "Mesa removida com sucesso!", erro: false });
  } catch (err) {
    console.error("Erro ao remover mesa:", err);
    return res.status(500).json({ mensagem: "Falha ao remover mesa.", erro: true });
  }
}

module.exports = { cadastrar, buscarMesas, buscarMesa, atualizar, remover };
