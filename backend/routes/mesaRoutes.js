const express = require("express")
const router = express.Router()
const mesaController = require("../controllers/mesaController")
const usuarioController = require("../controllers/usuarioController.js")

router.post("/novo", mesaController.cadastrar );

router.get("/", mesaController.buscarMesas);

router.get("/:id", mesaController.buscarMesa);

module.exports = router