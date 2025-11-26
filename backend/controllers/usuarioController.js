const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");

const { PrismaClient } = require("@prisma/client");
const client = new PrismaClient();

class usuarioController {

    static async cadastrar(req, res) {
    const { nome, sobrenome, estado, cidade, bairro, rua, numero, email, password } = req.body;

    if (!nome || !sobrenome || !estado || !cidade || !bairro || !rua || !numero || !email || !password) {
        return res.json({
            mensagem: "Todos os campos são obrigatórios!",
            erro: true
        });
    }

    const salt = bcrypt.genSaltSync(8);
    const hashpassword = bcrypt.hashSync(password, salt);

    try {
        const usuario = await client.usuario.create({
            data: {
                nome,
                sobrenome,
                estado,
                cidade,
                bairro,
                rua,
                numero: Number(numero),
                email,
                password: hashpassword,
            },
        });

        const token = jwt.sign({ id: usuario.id }, process.env.SENHA_SERVIDOR,
            { expiresIn: "2h" });

        res.json({
            mensagem: "Usuário cadastrado com sucesso!",
            erro: false,
            token: token
        });
    }
    catch (err) {
        console.log(err);
        return res.json({
            mensagem: "Falha ao criar usuário!",
            erro: true
        });
    }
}


    static async login(req, res) {
        const { email, password } = req.body;

        const usuario = await client.usuario.findUnique({
            where: {
                email: email,
            },
        });

        if (!usuario) {
            return res.json({
                msg: "Usuário não encontrado!",
            });
        }

        const passwordCorreta = bcrypt.compareSync(password, usuario.password);

        if (!passwordCorreta) {
            return res.json({
                msg: "Senha incorreta!",
            });
        }

        const token = jwt.sign({ id: usuario.id }, process.env.SENHA_SERVIDOR,
            { expiresIn: "2h" });

        res.json({
            msg: "Autenticado com sucesso!",
            token: token,
        });
    }

    static async verificarAutenticacao(req, res, next) {
        const authHeader = req.headers["authorization"]
        if (authHeader) {
            const token = authHeader.split(" ")[1];

            jwt.verify(token, process.env.SENHA_SERVIDOR, (err, payload) => {
                if (err) {
                    return res.json({
                        msg: "Token invalido!"
                    })
                }

                req.usuarioId = payload.id;
                next();
            })
        } else {
            return res.json({
                msg: "Token não encontrado!"
            })
        }
    }

    static async verificaAdmin(req, res, next) {
        if (req.usuarioId == null) {
            return res.json({
                msg: "Você não esstá autenticado"
            });
        }

        const usuario = await client.usuario.findUnique({
            where: {
                id: req.usuarioId,
            },
        })
        if (usuario.tipo === "cliente") {
            return res.json({
                msg:
                    "Acesso negado, você não é admin",
            });
        }

        next()

    }

    static async getUsuarioLogado(req, res) {
        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            return res.status(401).json({ erro: true, mensagem: "Token não fornecido" });
        }

        const token = authHeader.split(" ")[1];

        try {
            const decoded = jwt.verify(token, process.env.SENHA_SERVIDOR);
            const usuario = await client.usuario.findUnique({
                where: { id: decoded.id },
                select: { id: true, nome: true, email: true, tipo: true },
            });

            if (!usuario) {
                return res.status(404).json({ erro: true, mensagem: "Usuário não encontrado" });
            }

            res.json({ erro: false, usuario });
        } catch (err) {
            return res.status(401).json({ erro: true, mensagem: "Token inválido ou expirado" });
        }
    }

}

module.exports = usuarioController;
