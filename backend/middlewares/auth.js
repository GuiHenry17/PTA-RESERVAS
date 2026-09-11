const jwt = require("jsonwebtoken");

const verificarAutenticacao = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ mensagem: "Token não encontrado!" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.SENHA_SERVIDOR, (err, payload) => {
    if (err) {
      return res.status(401).json({ mensagem: "Token inválido!" });
    }
    req.usuarioId = payload.id;
    req.usuarioTipo = payload.tipo;
    next();
  });
};

const verificaAdmin = (req, res, next) => {
  if (!req.usuarioId) {
    return res.status(401).json({ mensagem: "Você não está autenticado." });
  }
  if (req.usuarioTipo !== "admin") {
    return res.status(403).json({ mensagem: "Acesso negado. Você não tem permissão de administrador." });
  }
  next();
};

module.exports = { verificarAutenticacao, verificaAdmin };
