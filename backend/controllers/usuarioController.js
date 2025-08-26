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


}

module.exports = usuarioController;