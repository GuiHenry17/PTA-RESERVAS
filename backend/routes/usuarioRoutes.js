const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController.js");
const auth = require("../middlewares/auth");

router.post("/cadastro", usuarioController.cadastrar);

router.post("/login", usuarioController.login);

router.get("/me", auth.verificarAutenticacao, usuarioController.getUsuarioLogado);

module.exports = router;
