const { PrismaClient } = require("@prisma/client");
const client = new PrismaClient();

class mesaController {

    static async cadastrar(req, res) {
        const { codigo, n_pessoas, status } = req.body;

        if (!codigo || !n_pessoas) {
            return res.json({
                mensagem: "Todos os campos são obrigatórios!",
                erro: true,
            });
        }

        try {
            const mesa = await client.mesa.create({
                data: {
                    codigo,
                    n_pessoas: parseInt(n_pessoas),
                    status: status || "disponível",
                },
            });

            return res.json({
                mensagem: "Mesa cadastrada com sucesso!",
                erro: false,
                mesa,
            });
        } catch (err) {
            console.error("Erro ao cadastrar mesa:", err);
            return res.json({
                mensagem: "Falha ao criar mesa!",
                erro: true,
            });
        }
    }

    static async buscarMesas(req, res) {
        try {
            const mesas = await client.mesa.findMany({});
            return res.json({
                mensagem: "Mesas encontradas com sucesso!",
                erro: false,
                mesas,
            });
        } catch (err) {
            return res.json({
                mensagem: "Falha ao buscar mesas!",
                erro: true,
            });
        }
    }

    static async buscarMesa(req, res) {
        const mesaId = parseInt(req.params.id);
        try {
            const mesa = await client.mesa.findUnique({
                where: { id: mesaId },
            });

            if (!mesa) {
                return res.json({
                    mensagem: "Mesa não encontrada!",
                    erro: true,
                });
            }

            return res.json({
                mensagem: "Mesa encontrada com sucesso!",
                erro: false,
                mesa,
            });
        } catch (err) {
            return res.json({
                mensagem: "Falha ao buscar mesa!",
                erro: true,
            });
        }
    }

    static async atualizar(req, res) {
        const mesaId = parseInt(req.params.id);
        const { codigo, n_pessoas, status } = req.body;

        if (!codigo || !n_pessoas || !status) {
            return res.json({ mensagem: "Todos os campos são obrigatórios!", erro: true });
        }

        try {
            const mesa = await client.mesa.update({
                where: { id: mesaId },
                data: { codigo, n_pessoas, status },
            });

            return res.json({
                mensagem: "Mesa atualizada com sucesso!",
                erro: false,
                mesa,
            });
        } catch (err) {
            return res.json({ mensagem: "Falha ao atualizar mesa!", erro: true });
        }
    }

    static async remover(req, res) {
        const mesaId = parseInt(req.params.id);

        try {
            const mesa = await client.mesa.findUnique({
                where: { id: mesaId },
            });

            if (!mesa) {
                return res.json({
                    mensagem: "Mesa não encontrada!",
                    erro: true,
                });
            }

            await client.mesa.delete({
                where: { id: mesaId },
            });

            return res.json({
                mensagem: "Mesa removida com sucesso!",
                erro: false,
            });
        } catch (err) {
            console.error("Erro ao remover mesa:", err);
            return res.json({
                mensagem: "Falha ao remover mesa!",
                erro: true,
            });
        }
    }


}

module.exports = mesaController;
