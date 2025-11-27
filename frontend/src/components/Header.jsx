import { Link } from "react-router-dom";
import styles from "../styles/Header.module.css";

export default function Header() {
  const user = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
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

        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/cadastro">Cadastro</Link>
          </>
        )}
      </nav>

      {user && (
        <div className={styles.actions}>
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
