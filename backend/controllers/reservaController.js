const { PrismaClient } = require("@prisma/client");
const client = new PrismaClient();

class reservaController {
  static async reservar(req, res) {
    const { data, n_pessoas, mesaId } = req.body;
    const usuarioId = req.usuarioId;

    if (!data || !n_pessoas || !mesaId) {
      return res.json({
        mensagem: "Todos os campos são obrigatórios!",
        erro: true,
      });
    }

    try {

      const mesa = await client.mesa.findUnique({
        where: { id: parseInt(mesaId) },
      });

      if (!mesa) {
        return res.json({ mensagem: "Mesa não encontrada!", erro: true });
      }

      if (mesa.status === "reservada") {
        return res.json({
          mensagem: "A mesa já está ocupada e não pode ser reservada!",
          erro: true,
        });
      }

      const reservaExistente = await client.reserva.findFirst({
        where: {
          mesa_id: parseInt(mesaId),
          status: true,
          data: new Date(data),
        },
      });

      if (reservaExistente) {
        return res.json({
          mensagem: "Essa mesa já está reservada para essa data!",
          erro: true,
        });
      }

      const [reserva] = await client.$transaction([
        client.reserva.create({
          data: {
            data: new Date(data),
            n_pessoas: parseInt(n_pessoas),
            mesa_id: parseInt(mesaId),
            usuario_id: usuarioId,
          },
        }),
        client.mesa.update({
          where: { id: parseInt(mesaId) },
          data: { status: "reservada" },
        }),
      ]);

      return res.json({
        mensagem: "Reserva criada com sucesso!",
        erro: false,
        reserva,
      });
    } catch (err) {
      console.error("Erro ao criar reserva:", err);
      return res.json({ mensagem: "Falha ao criar reserva!", erro: true });
    }
  }

  static async minhasReservas(req, res) {
    const usuarioId = req.usuarioId;

    try {
      const reservas = await client.reserva.findMany({
        where: { usuario_id: usuarioId },
        include: {
          mesa: true,
        },
      });

      return res.json({
        mensagem: "Reservas encontradas com sucesso!",
        erro: false,
        reservas,
      });
    } catch (err) {
      console.error("Erro ao buscar reservas:", err);
      return res.json({
        mensagem: "Falha ao buscar reservas!",
        erro: true,
      });
    }
  }

  static async cancelar(req, res) {
    const { reservaId } = req.body;
    const usuarioId = req.usuarioId;

    if (!reservaId) {
      return res.json({
        mensagem: "O ID da reserva é obrigatório!",
        erro: true,
      });
    }

    try {
      const reserva = await client.reserva.findUnique({
        where: { id: parseInt(reservaId) },
      });

      if (!reserva) {
        return res.json({
          mensagem: "Reserva não encontrada!",
          erro: true,
        });
      }

      if (reserva.usuario_id !== usuarioId) {
        return res.json({
          mensagem: "Você não pode cancelar reservas de outro usuário!",
          erro: true,
        });
      }

      await client.reserva.delete({
        where: { id: parseInt(reservaId) },
      });

      await client.mesa.update({
        where: { id: reserva.mesa_id },
        data: { status: "disponível" },
      });

      return res.json({
        mensagem: "Reserva cancelada com sucesso!",
        erro: false,
      });
    } catch (err) {
      console.error("Erro ao cancelar reserva:", err);
      return res.json({
        mensagem: "Falha ao cancelar reserva!",
        erro: true,
      });
    }
  }

  static async buscarPorData(req, res) {
    const { data } = req.query;

    if (!data) {
      return res.json({
        mensagem: "A data é obrigatória!",
        erro: true,
      });
    }

    try {
      const reservas = await client.reserva.findMany({
        where: {
          data: {
            equals: new Date(data),
          },
        },
        include: {
          mesa: true,
          usuario: true,
        },
      });

      return res.json({
        mensagem: "Reservas encontradas com sucesso!",
        erro: false,
        reservas,
      });
    } catch (err) {
      console.error("Erro ao buscar reservas:", err);
      return res.json({
        mensagem: "Falha ao buscar reservas!",
        erro: true,
      });
    }
  }
}

module.exports = reservaController;
