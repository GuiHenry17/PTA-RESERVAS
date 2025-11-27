import { useNavigate } from "react-router-dom";
import "../styles/VoltarHome.css"

export default function VoltarHome() {
  const navigate = useNavigate();

  return (
    <button className="voltar-home" onClick={() => navigate("/")}>
      ⬅ Voltar
    </button>
  );
}
