const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const client = require("../prismaClient");

// Regex simples de validação de e-mail
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function cadastrar(req, res) {
  const { nome, sobrenome, email, password, tipo } = req.body;

  if (!nome || !sobrenome || !email || !password) {
    return res.status(400).json({
      mensagem: "Todos os campos são obrigatórios!",
      erro: true,
    });
  }

  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({
      mensagem: "Endereço de e-mail inválido.",
      erro: true,
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      mensagem: "A senha deve ter pelo menos 6 caracteres.",
      erro: true,
    });
  }

  const tiposValidos = ["cliente", "admin"];
  if (tipo && !tiposValidos.includes(tipo)) {
    return res.status(400).json({
      mensagem: "Tipo de usuário inválido! Somente 'cliente' ou 'admin'.",
      erro: true,
    });
  }

  const hashpassword = bcrypt.hashSync(password, 10);

  try {
    const usuario = await client.usuario.create({
      data: {
        nome: nome.trim(),
        sobrenome: sobrenome.trim(),
        email: email.toLowerCase().trim(),
        password: hashpassword,
        tipo: tipo || "cliente",
      },
    });

    const token = jwt.sign(
      { id: usuario.id, tipo: usuario.tipo, nome: usuario.nome },
      process.env.SENHA_SERVIDOR,
      { expiresIn: "2h" }
    );

    return res.status(201).json({
      mensagem: "Usuário cadastrado com sucesso!",
      erro: false,
      token,
    });
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(409).json({
        mensagem: "Este e-mail já está cadastrado.",
        erro: true,
      });
    }
    console.error("Erro ao cadastrar usuário:", err);
    return res.status(500).json({
      mensagem: "Falha ao criar usuário.",
      erro: true,
    });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      mensagem: "E-mail e senha são obrigatórios.",
      erro: true,
    });
  }

  try {
    const usuario = await client.usuario.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!usuario) {
      return res.status(401).json({
        mensagem: "Usuário não encontrado!",
        erro: true,
      });
    }

    const passwordCorreta = bcrypt.compareSync(password, usuario.password);
    if (!passwordCorreta) {
      return res.status(401).json({
        mensagem: "Senha incorreta!",
        erro: true,
      });
    }

    const token = jwt.sign(
      { id: usuario.id, tipo: usuario.tipo, nome: usuario.nome },
      process.env.SENHA_SERVIDOR,
      { expiresIn: "2h" }
    );

    return res.json({
      mensagem: "Autenticado com sucesso!",
      erro: false,
      token,
    });
  } catch (err) {
    console.error("Erro ao fazer login:", err);
    return res.status(500).json({
      mensagem: "Falha ao realizar login.",
      erro: true,
    });
  }
}

async function getUsuarioLogado(req, res) {
  try {
    const usuario = await client.usuario.findUnique({
      where: { id: req.usuarioId },
      select: { id: true, nome: true, sobrenome: true, email: true, tipo: true },
    });

    if (!usuario) {
      return res.status(404).json({ erro: true, mensagem: "Usuário não encontrado." });
    }

    return res.json({ erro: false, usuario });
  } catch (err) {
    console.error("Erro ao buscar usuário logado:", err);
    return res.status(500).json({ erro: true, mensagem: "Falha ao buscar dados do usuário." });
  }
}

module.exports = { cadastrar, login, getUsuarioLogado };
