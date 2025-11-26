import { Link } from "react-router-dom";
import styles from "../styles/Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <h2 className={styles.logo}>
        Restaurante
        <br /> <b>do Joilço</b>
      </h2>

      <nav className={styles.menu}>
        <Link to="/">Home</Link>
        <Link to="/cardapio">Cardápio</Link>
        <Link to="/login">Login</Link>
        <Link to="/cadastro">Cadastro</Link>
      </nav>

      <Link to="/reservas" className={styles.reservasButton}>
        Minhas
        <br />
        Reservas
      </Link>
    </header>
  );
}
