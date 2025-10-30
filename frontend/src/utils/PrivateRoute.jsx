import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Acesso negado! Você precisa estar logado para continuar.");
        return <Navigate to="/login" replace />;
    }

    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const agora = Math.floor(Date.now() / 1000);

        if (payload.exp && payload.exp < agora) {
            localStorage.removeItem("token");
            alert("Sessão expirada! Faça login novamente.");
            return <Navigate to="/login" replace />;
        }

        return children;
    } catch {
        localStorage.removeItem("token");
        alert("Token inválido. Faça login novamente.");
        return <Navigate to="/login" replace />;
    }
}
