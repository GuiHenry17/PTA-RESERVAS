const client = require("../prismaClient");

async function reservar(req, res) {
  const { data, n_pessoas, mesaId } = req.body;
  const usuarioId = req.usuarioId;

  if (!data || !n_pessoas || !mesaId) {
    return res.status(400).json({ mensagem: "Data, número de pessoas e ID da mesa são obrigatórios.", erro: true });
  }

  const pessoas = parseInt(n_pessoas);
  if (isNaN(pessoas) || pessoas < 1) {
    return res.status(400).json({ mensagem: "Número de pessoas deve ser um inteiro positivo.", erro: true });
  }

  const dataReserva = new Date(data);
  if (isNaN(dataReserva.getTime())) {
    return res.status(400).json({ mensagem: "Data inválida.", erro: true });
  }

  if (dataReserva < new Date()) {
    return res.status(400).json({ mensagem: "Não é possível reservar para uma data no passado.", erro: true });
  }

  const mesaIdInt = parseInt(mesaId);
  if (isNaN(mesaIdInt)) {
    return res.status(400).json({ mensagem: "ID de mesa inválido.", erro: true });
  }

  try {
    const reserva = await client.$transaction(async (tx) => {
      const mesa = await tx.mesa.findUnique({ where: { id: mesaIdInt } });

      if (!mesa) {
        const err = new Error("Mesa não encontrada.");
        err.statusCode = 404;
        throw err;
      }

      if (mesa.status === "inativa") {
        const err = new Error("Esta mesa está inativa e não pode ser reservada.");
        err.statusCode = 400;
        throw err;
      }

      if (mesa.status === "reservada") {
        const err = new Error("A mesa já está reservada.");
        err.statusCode = 409;
        throw err;
      }

      if (pessoas > mesa.n_lugares) {
        const err = new Error(`A mesa comporta no máximo ${mesa.n_lugares} pessoa(s).`);
        err.statusCode = 400;
        throw err;
      }

      const reservaExistente = await tx.reserva.findFirst({
        where: { mesa_id: mesaIdInt, status: true, data: dataReserva },
      });

      if (reservaExistente) {
        const err = new Error("Essa mesa já está reservada para essa data e horário.");
        err.statusCode = 409;
        throw err;
      }

      const novaReserva = await tx.reserva.create({
        data: { data: dataReserva, n_pessoas: pessoas, mesa_id: mesaIdInt, usuario_id: usuarioId },
        include: { mesa: { select: { id: true, codigo: true, n_lugares: true } } },
      });

      await tx.mesa.update({ where: { id: mesaIdInt }, data: { status: "reservada" } });

      return novaReserva;
    });

    return res.status(201).json({ mensagem: "Reserva criada com sucesso!", erro: false, reserva });
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ mensagem: err.message, erro: true });
    }
    console.error("Erro ao criar reserva:", err);
    return res.status(500).json({ mensagem: "Falha ao criar reserva.", erro: true });
  }
}

async function minhasReservas(req, res) {
  try {
    const reservas = await client.reserva.findMany({
      where: { usuario_id: req.usuarioId },
      include: { mesa: { select: { id: true, codigo: true, n_lugares: true, status: true } } },
      orderBy: { data: "desc" },
    });
    return res.json({ mensagem: "Reservas encontradas com sucesso!", erro: false, reservas });
  } catch (err) {
    console.error("Erro ao buscar reservas:", err);
    return res.status(500).json({ mensagem: "Falha ao buscar reservas.", erro: true });
  }
}

async function cancelar(req, res) {
  const { reservaId } = req.body;
  const usuarioId = req.usuarioId;

  if (!reservaId) {
    return res.status(400).json({ mensagem: "O ID da reserva é obrigatório.", erro: true });
  }

  const reservaIdInt = parseInt(reservaId);
  if (isNaN(reservaIdInt)) {
    return res.status(400).json({ mensagem: "ID de reserva inválido.", erro: true });
  }

  try {
    await client.$transaction(async (tx) => {
      const reserva = await tx.reserva.findUnique({ where: { id: reservaIdInt } });

      if (!reserva) {
        const err = new Error("Reserva não encontrada.");
        err.statusCode = 404;
        throw err;
      }

      if (reserva.usuario_id !== usuarioId) {
        const err = new Error("Você não tem permissão para cancelar a reserva de outro usuário.");
        err.statusCode = 403;
        throw err;
      }

      if (!reserva.status) {
        const err = new Error("Esta reserva já foi cancelada.");
        err.statusCode = 409;
        throw err;
      }

      await tx.reserva.update({ where: { id: reservaIdInt }, data: { status: false } });

      await tx.mesa.updateMany({
        where: { id: reserva.mesa_id, status: "reservada" },
        data: { status: "disponível" },
      });
    });

    return res.json({ mensagem: "Reserva cancelada com sucesso!", erro: false });
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ mensagem: err.message, erro: true });
    }
    console.error("Erro ao cancelar reserva:", err);
    return res.status(500).json({ mensagem: "Falha ao cancelar reserva.", erro: true });
  }
}

async function todasReservas(req, res) {
  try {
    const reservas = await client.reserva.findMany({
      include: {
        mesa: { select: { id: true, codigo: true, n_lugares: true, status: true } },
        usuario: { select: { id: true, nome: true, sobrenome: true, email: true } },
      },
      orderBy: { data: "desc" },
    });
    return res.json({ mensagem: "Reservas encontradas com sucesso!", erro: false, reservas });
  } catch (err) {
    console.error("Erro ao buscar todas as reservas:", err);
    return res.status(500).json({ mensagem: "Falha ao buscar reservas.", erro: true });
  }
}

async function buscarPorData(req, res) {
  const { data } = req.query;

  if (!data) {
    return res.status(400).json({ mensagem: "A data é obrigatória.", erro: true });
  }

  const dataFiltro = new Date(data);
  if (isNaN(dataFiltro.getTime())) {
    return res.status(400).json({ mensagem: "Formato de data inválido.", erro: true });
  }

  try {
    const reservas = await client.reserva.findMany({
      where: { data: { equals: dataFiltro }, status: true },
      include: {
        mesa: { select: { id: true, codigo: true, n_lugares: true } },
        usuario: { select: { id: true, nome: true, sobrenome: true, email: true } },
      },
      orderBy: { data: "asc" },
    });
    return res.json({ mensagem: "Reservas encontradas com sucesso!", erro: false, reservas });
  } catch (err) {
    console.error("Erro ao buscar reservas por data:", err);
    return res.status(500).json({ mensagem: "Falha ao buscar reservas.", erro: true });
  }
}

module.exports = { reservar, minhasReservas, cancelar, todasReservas, buscarPorData };
