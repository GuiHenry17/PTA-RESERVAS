const express = require("express");
const router = express.Router();
const mesaController = require("../controllers/mesaController");
const auth = require("../middlewares/auth");

router.get("/", mesaController.buscarMesas);
router.get("/:id", mesaController.buscarMesa);

router.post("/novo", auth.verificarAutenticacao, auth.verificaAdmin, mesaController.cadastrar);
router.put("/:id", auth.verificarAutenticacao, auth.verificaAdmin, mesaController.atualizar);
router.delete("/:id", auth.verificarAutenticacao, auth.verificaAdmin, mesaController.remover);

module.exports = router;
