const express = require("express")
const router = express.Router()
const usuarioController = require("../controllers/usuarioController.js")

router.get("/logged", usuarioController.verificarAutenticacao, (req, res)=> {
    res.json({
        msg: `Você está logado com o ID ${req.usuarioId} e pode acessar este recurso`
    })
});

module.exports = router