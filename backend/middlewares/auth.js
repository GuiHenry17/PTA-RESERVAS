const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const client = new PrismaClient();

const verificarAutenticacao = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (authHeader) {
        const token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.SENHA_SERVIDOR, (err, payload) => {
            if (err) {
                return res.status(401).json({
                    msg: "Token inválido!"
                });
            }

            req.usuarioId = payload.id;  
            next();  
        });
    } else {
        return res.status(401).json({
            msg: "Token não encontrado!"
        });
    }
};

const verificaAdmin = async (req, res, next) => {
    if (!req.usuarioId) {
        return res.status(401).json({
            msg: "Você não está autenticado"
        });
    }

    try {
        const usuario = await client.usuario.findUnique({
            where: { id: req.usuarioId },
        });

        if (usuario.tipo === "cliente") {
            return res.status(403).json({
                msg: "Acesso negado, você não é admin"
            });
        }

        next();  
    } catch (err) {
        return res.status(500).json({
            msg: "Erro ao verificar tipo de usuário"
        });
    }
};

module.exports = { verificarAutenticacao, verificaAdmin };