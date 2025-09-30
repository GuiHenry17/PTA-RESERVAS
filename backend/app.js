const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const loggedRoutes = require("./routes/LoggedRoutes");
app.use("/", loggedRoutes);

const usuariosRoutes = require("./routes/usuarioRoutes");
app.use("/auth", usuariosRoutes);

const AdminRoutes = require("./routes/AdminRoutes");
app.use("/", AdminRoutes);

module.exports = app;