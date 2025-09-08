const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");

const { PrismaClient } = require("@prisma/client");
const client = new PrismaClient();

class usuarioController {

    static async cadastrar(req, res) {
        const { nome, email, senha } = req.body;

        const salt = bcrypt.genSaltSync(8)
        const hashSenha = bcrypt.hashSync(senha, salt)

        await client.usuario.create({
            data: {
                nome,
                email,
                senha: hashSenha,
            },
        });

        if(res.status(200)) {
            res.json({
            mensagem: "Usuário cadastrado com sucesso!",
            erro: false
        })}
        else{
            res.json({
                mensagem: "Falha ao criar usuário!",
                erro: true
            })
        }
    }

     static async login(req, res) {
        const { email, senha } = req.body;

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

        const senhaCorreta = bcrypt.compareSync(senha, usuario.senha);

        if (!senhaCorreta) {
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

    static async verificarAutenticacao(req, res, next){
        const authHeader = req.headers["authorization"]
        if (authHeader){
            const token = authHeader.split(" ")[1];

            jwt.verify(token, process.env.SENHA_SERVIDOR, (err, payload)=> {
                if(err){
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


}

module.exports = usuarioController;