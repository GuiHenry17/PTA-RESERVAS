const express = require("express");
const app = express();
const cors = require("cors");

// CORS — restringe origens em produção via env, aceita localhost em dev
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : ["http://localhost:5173", "http://localhost:3000"];

app.use(cors({
  origin: (origin, callback) => {
    // Permite requests sem origin (ex: curl, Postman, testes)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS bloqueado para origin: ${origin}`));
  },
  credentials: true,
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const loggedRoutes = require("./routes/LoggedRoutes");
app.use("/", loggedRoutes);

const usuariosRoutes = require("./routes/usuarioRoutes");
app.use("/auth", usuariosRoutes);

const AdminRoutes = require("./routes/AdminRoutes");
app.use("/", AdminRoutes);

const mesaRoutes = require("./routes/mesaRoutes");
app.use("/mesas", mesaRoutes);

const reservaRoutes = require("./routes/reservaRoutes");
app.use("/reservas", reservaRoutes);

// Handler de erro global — evita stack trace exposto ao cliente
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("[Erro não tratado]", err);
  return res.status(500).json({
    mensagem: "Erro interno do servidor.",
    erro: true,
  });
});

module.exports = app;
