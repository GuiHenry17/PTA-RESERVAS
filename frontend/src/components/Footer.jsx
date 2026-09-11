import { Link } from "react-router-dom";
import styles from "../styles/Footer.module.css";

export default function Footer() {
  const ano = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.brandName}>Volta &amp; Meia</span>
          <span className={styles.brandTagline}>Gastronomia autêntica desde sempre</span>
        </div>

        <nav className={styles.footerNav} aria-label="Links do rodapé">
          <Link to="/" className={styles.footerLink}>Início</Link>
          <Link to="/cardapio" className={styles.footerLink}>Cardápio</Link>
          <Link to="/reservar" className={styles.footerLink}>Reservar</Link>
        </nav>

        <div className={styles.meta}>
          <span className={styles.copy}>&copy; {ano} Volta &amp; Meia</span>
          <span className={styles.credits}>
            Desenvolvido por <strong>Guilherme Henrique</strong> e <strong>Enzo Mazer</strong>
          </span>
        </div>
      </div>
    </footer>
  );
}
