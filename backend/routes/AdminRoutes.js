const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");

router.get("/admin", auth.verificarAutenticacao, auth.verificaAdmin, (req, res) => {
    res.json({
        msg: `Você está logado com o ID ${req.usuarioId} e é Admin e pode acessar este recurso`
    });
});

module.exports = router;
