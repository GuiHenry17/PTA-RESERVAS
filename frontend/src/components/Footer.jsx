import styles from "../styles/Footer.module.css";

export default function Footer() {
  const anoAtual = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <p>© {anoAtual} - Reservas | Todos os direitos reservados.</p>
      <p className={styles.subtext}>
        Desenvolvido por <strong>Guilherme Henrique</strong> e{" "}
        <strong>Enzo Mazer</strong>.
      </p>
    </footer>
  );
}
