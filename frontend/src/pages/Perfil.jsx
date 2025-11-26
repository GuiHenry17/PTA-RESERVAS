import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Perfil.module.css";

export default function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    fetch("http://localhost:3000/auth/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.usuario) {
          setUsuario(data.usuario);
        } else {
          setError("Falha ao carregar informações do usuário");
        }
      })
      .catch(() => setError("Erro de conexão com o servidor"));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Perfil do Usuário</h2>
        {error && <p className={styles.error}>{error}</p>}
        {usuario ? (
          <>
            <p>
              <strong>Nome:</strong> {usuario.nome}
            </p>
            <p>
              <strong>Email:</strong> {usuario.email}
            </p>
          </>
        ) : (
          <p>Carregando informações...</p>
        )}
        <button className={styles.button} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
