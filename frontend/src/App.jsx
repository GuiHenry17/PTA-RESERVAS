import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import CadastroClientes from "./pages/CadastroClientes";
import PrivateRoute from "./utils/PrivateRoute";
import AdminRoute from "./utils/AdminRoute";
import ReservarMesa from "./pages/ReservarMesa";
import ListarReservas from "./pages/ListarReservas";
import Cardapio from "./pages/Cardapio";
import AdminDashboard from "./pages/AdminDashboard";
import AdminMesas from "./pages/AdminMesas";
import AdminReservas from "./pages/AdminReservas";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<CadastroClientes />} />
        <Route path="/cardapio" element={<Cardapio />} />

        {/* Rotas autenticadas */}
        <Route path="/reservar" element={<PrivateRoute><ReservarMesa /></PrivateRoute>} />
        <Route path="/reservas" element={<PrivateRoute><ListarReservas /></PrivateRoute>} />

        {/* Rotas administrativas */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/mesas" element={<AdminRoute><AdminMesas /></AdminRoute>} />
        <Route path="/admin/reservas" element={<AdminRoute><AdminReservas /></AdminRoute>} />
      </Routes>
    </Router>
  );
}
