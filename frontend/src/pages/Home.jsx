import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <Header />

      <main>
        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.heroBg} aria-hidden="true" />
          <div className={styles.heroOverlay} aria-hidden="true" />

          <div className={styles.heroContent}>
            <span className={styles.heroEyebrow}>Bem-vindo ao</span>
            <h1 className={styles.heroTitle}>
              Restaurante<br />do Joilço
            </h1>
            <p className={styles.heroSub}>
              Gastronomia autêntica com o melhor atendimento da cidade.<br />
              Reserve sua mesa e viva uma experiência inesquecível.
            </p>
            <div className={styles.heroCtas}>
              <Link to="/reservar" className={styles.ctaPrimary}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Reservar Mesa
              </Link>
              <Link to="/cardapio" className={styles.ctaSecondary}>
                Ver Cardápio
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className={styles.features} aria-label="Diferenciais">
          <div className={styles.featuresInner}>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Cardápio Exclusivo</h3>
              <p className={styles.featureDesc}>Pratos preparados com ingredientes selecionados e técnicas artesanais.</p>
            </div>

            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Reserva Online</h3>
              <p className={styles.featureDesc}>Reserve sua mesa em segundos, sem fila e sem surpresas.</p>
            </div>

            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Ambiente Especial</h3>
              <p className={styles.featureDesc}>Um espaço pensado para momentos únicos com quem você ama.</p>
            </div>
          </div>
        </section>

        {/* CTA band */}
        <section className={styles.ctaBand}>
          <div className={styles.ctaBandInner}>
            <div>
              <h2 className={styles.ctaBandTitle}>Pronto para reservar?</h2>
              <p className={styles.ctaBandDesc}>Faça sua reserva agora e garanta sua mesa para uma noite especial.</p>
            </div>
            <Link to="/reservar" className={styles.ctaBandBtn}>
              Reservar Agora
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
