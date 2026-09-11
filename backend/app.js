const express = require("express");
const app = express();
const cors = require("cors");

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : ["http://localhost:5173", "http://localhost:3000"];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS bloqueado para origin: ${origin}`));
  },
  credentials: true,
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const usuariosRoutes = require("./routes/usuarioRoutes");
app.use("/auth", usuariosRoutes);

const mesaRoutes = require("./routes/mesaRoutes");
app.use("/mesas", mesaRoutes);

const reservaRoutes = require("./routes/reservaRoutes");
app.use("/reservas", reservaRoutes);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("[Erro não tratado]", err);
  return res.status(500).json({ mensagem: "Erro interno do servidor.", erro: true });
});

module.exports = app;
