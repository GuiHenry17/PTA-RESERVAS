const express = require("express");
const app = express();
const port = 3000;
app.use(express.urlencoded({extended: true}));
app.use(express.json());

const loggedRoutes = require('./routes/LoggedRoutes')
app.use("/", loggedRoutes)

const usuariosRoutes = require("./routes/usuarioRoutes")
app.use("/", usuariosRoutes)

const AdminRoutes = require('./routes/AdminRoutes')
app.use("/", AdminRoutes)

app.listen(port, (err) => {
    console.log(`Aplicação rodando em http://localhost:${port}`)
});