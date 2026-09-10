import { Link } from "react-router-dom";
import styles from "../styles/Header.module.css";

function getTipo() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    const agora = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < agora) return null;
    return payload.tipo || null;
  } catch {
    return null;
  }
}

export default function Header() {
  const token = localStorage.getItem("token");
  const tipo = getTipo();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <header className={styles.header}>
      <h2 className={styles.logo}>
        Restaurante
        <br /> <b>do Joilço</b>
      </h2>

      <nav className={styles.menu}>
        <Link to="/">Home</Link>
        <Link to="/cardapio">Cardápio</Link>

        {!token && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/cadastro">Cadastro</Link>
          </>
        )}
      </nav>

      {token && (
        <div className={styles.actions}>
          {tipo === "admin" && (
            <Link to="/admin" className={styles.adminButton}>
              Painel Admin
            </Link>
          )}

          <Link to="/reservas" className={styles.reservasButton}>
            Minhas
            <br />
            Reservas
          </Link>

          <button className={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
