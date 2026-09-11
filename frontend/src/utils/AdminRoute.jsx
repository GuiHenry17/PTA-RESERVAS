import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const agora = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < agora) {
      localStorage.removeItem("token");
      return <Navigate to="/login" replace />;
    }

    if (payload.tipo !== "admin") {
      return <Navigate to="/" replace />;
    }

    return children;
  } catch {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }
}
