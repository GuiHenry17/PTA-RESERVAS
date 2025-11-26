import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import CadastroClientes from "./pages/CadastroClientes";
import Perfil from "./pages/Perfil";
import CadastroMesas from "./pages/CadastroMesas";
import ListarMesas from "./pages/ListarMesas";
import PrivateRoute from "./utils/PrivateRoute";
import ReservarMesa from "./pages/ReservarMesa";
import ListarReservas from "./pages/ListarReservas";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<Home />} />
        <Route path="/cadastro" element={<CadastroClientes />} />
        <Route
          path="/perfil"
          element={
            <PrivateRoute>
              <Perfil />
            </PrivateRoute>
          }
        />
        <Route
          path="/cadastro/mesa"
          element={
            <PrivateRoute>
              <CadastroMesas />
            </PrivateRoute>
          }
        />
        <Route
          path="/mesas"
          element={
            <PrivateRoute>
              <ListarMesas />
            </PrivateRoute>
          }
        />
        <Route
          path="/reservar"
          element={
            <PrivateRoute>
              <ReservarMesa />
            </PrivateRoute>
          }
        />
        <Route
          path="/reservas"
          element={
            <PrivateRoute>
              <ListarReservas />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}
