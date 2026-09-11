const express = require("express");
const router = express.Router();
const reservaController = require("../controllers/reservaController");
const auth = require("../middlewares/auth");

router.post("/novo", auth.verificarAutenticacao, reservaController.reservar);

router.get("/todas", auth.verificarAutenticacao, auth.verificaAdmin, reservaController.todasReservas);

router.get("/list", auth.verificarAutenticacao, auth.verificaAdmin, reservaController.buscarPorData);

router.get("/", auth.verificarAutenticacao, reservaController.minhasReservas);

router.delete("/", auth.verificarAutenticacao, reservaController.cancelar);

module.exports = router;
