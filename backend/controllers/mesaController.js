const { PrismaClient } = require("@prisma/client");
const client = new PrismaClient();

class mesaController {

    static async cadastrar(req, res) {
        const { codigo, n_lugares } = req.body;

        if (!codigo || !n_lugares) {
            return res.json({
                mensagem: "Todos os campos são obrigatórios!",
                erro: true
            })
        }

        try {
            const mesa = await client.mesa.create({
                data: {
                    codigo,
                    n_lugares
                },
            });

            res.json({
                mensagem: "Mesa cadastrada com sucesso!",
                erro: false,
            })
        } 
        catch (err) {
            return res.json({
                mensagem: "Falha ao criar usuário! Erro: ",
                erro: true
            })
        }
    }

    static async buscarMesas(req, res) {
        
        try{
            const mesas = await client.mesa.findMany({});

        return res.json({
            mensagem: "Mesas encontradas com sucesso!",
            erro: false,
            mesas
        });
    }
    catch (err) {
        return res.json({
            mensagem: "Falha ao buscar mesas!", 
            erro: true
        })
    }
    }

    static async buscarMesa(req, res) {
        const mesaId = parseInt(req.params.id)

        try{
        const mesa = await client.mesa.findUnique({
            where: {
                id: mesaId
            }
        })

        return res.json({
            mensagem: "Mesa encontrada com sucesso!",
            erro: false,
            mesa
        })
    } 
    catch(err){
            return res.json({
                mensagem: "Falha ao buscar mesa!", 
                erro: true
            })
        }

    }
}

module.exports = mesaController;
