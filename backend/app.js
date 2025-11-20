const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors())

const loggedRoutes = require("./routes/LoggedRoutes");
app.use("/", loggedRoutes);

const usuariosRoutes = require("./routes/usuarioRoutes");
app.use("/auth", usuariosRoutes);

const AdminRoutes = require("./routes/AdminRoutes");
app.use("/", AdminRoutes);

const mesaRoutes = require("./routes/mesaRoutes");
app.use("/mesas", mesaRoutes)

const reservaRoutes = require("./routes/reservaRoutes");
app.use("/reservas", reservaRoutes)

module.exports = app;