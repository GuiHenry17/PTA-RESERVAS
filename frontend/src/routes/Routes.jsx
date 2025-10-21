import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Perfil from "../pages/Perfil";
import Login from "../pages/Login";
import CadastroClientes from "../pages/CadastroClientes";

export default function Routing() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />}></Route>
                <Route path="/perfil" element={<Perfil />}></Route>
                <Route path="/login" element={<Login />}></Route>
                <Route path="/cadastro/cliente" element={<CadastroClientes />}></Route>

            </Routes>
        </BrowserRouter>
    )
}

