import styles from '../styles/Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.links}>
        <div>
          <h4>Links Rápidos</h4>
          <p>Início</p>
          <p>Sobre</p>
          <p>Contato</p>
        </div>
        <div>
          <h4>Social</h4>
          <p>Twitter</p>
          <p>LinkedIn</p>
          <p>Instagram</p>
        </div>
      </div>
      <div className={styles.copy}>
        <p>© 2025 MeuSite. Todos os direitos reservados.</p>
      </div>
    </footer>
  )
}
