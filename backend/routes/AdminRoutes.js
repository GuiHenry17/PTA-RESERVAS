const express = require("express")
const router = express.Router()
const usuarioController = require("../controllers/usuarioController.js")

router.get("/admin", usuarioController.verificarAutenticacao, usuarioController.verificaAdmin, (req, res) => {
    res.json({
        msg: `Você está logado com o ID ${req.usuarioId} e é Admin e pode acessar este recurso`
    })
});

module.exports = router