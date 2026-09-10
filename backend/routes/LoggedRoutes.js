const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");

router.get("/logged", auth.verificarAutenticacao, (req, res) => {
    res.json({
        msg: `Você está logado com o ID ${req.usuarioId} e pode acessar este recurso`
    });
});

module.exports = router;
