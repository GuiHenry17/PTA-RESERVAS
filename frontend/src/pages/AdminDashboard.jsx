import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/Admin.module.css";
import Footer from "../components/Footer";
import API_URL from "../utils/api";

const STAT_ICONS = {
  total: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  disponiveis: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="10" /><polyline points="9 12 11 14 15 10" />
    </svg>
  ),
  reservadas: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  reservasTotal: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
  ),
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, disponiveis: 0, reservadas: 0, inativas: 0, reservasTotal: 0, reservasAtivas: 0 });
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const [resMesas, resReservas] = await Promise.all([
          fetch(`${API_URL}/mesas`),
          fetch(`${API_URL}/reservas/todas`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const dataMesas = await resMesas.json();
        const dataReservas = await resReservas.json();

        const mesas = dataMesas.mesas || [];
        const reservas = dataReservas.reservas || [];

        setStats({
          total: mesas.length,
          disponiveis: mesas.filter((m) => m.status === "disponível").length,
          reservadas: mesas.filter((m) => m.status === "reservada").length,
          inativas: mesas.filter((m) => m.status === "inativa").length,
          reservasTotal: reservas.length,
          reservasAtivas: reservas.filter((r) => r.status).length,
        });
      } catch {
        // silencia — dashboard não crítico
      } finally {
        setCarregando(false);
      }
    })();
  }, []);

  const statCards = [
    { key: "total", icon: STAT_ICONS.total, label: "Total de Mesas", value: stats.total, desc: "cadastradas no sistema" },
    { key: "disponiveis", icon: STAT_ICONS.disponiveis, label: "Disponíveis", value: stats.disponiveis, desc: "prontas para reserva" },
    { key: "reservadas", icon: STAT_ICONS.reservadas, label: "Reservadas", value: stats.reservadas, desc: "com reserva ativa" },
    { key: "inativas", icon: STAT_ICONS.reservadas, label: "Inativas", value: stats.inativas, desc: "desativadas pelo admin" },
    { key: "reservasTotal", icon: STAT_ICONS.reservasTotal, label: "Total de Reservas", value: stats.reservasTotal, desc: `${stats.reservasAtivas} ativas` },
  ];

  return (
    <div className={styles.layout}>
      <nav className={styles.topbar} aria-label="Navegação do painel admin">
        <div className={styles.topbarBrand}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
          <span>Painel Admin</span>
        </div>
        <div className={styles.topbarNav}>
          <Link to="/admin" className={`${styles.topbarLink} ${styles.topbarLinkAtivo}`}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
            <span>Dashboard</span>
          </Link>
          <Link to="/admin/mesas" className={styles.topbarLink}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" /></svg>
            <span>Mesas</span>
          </Link>
          <Link to="/admin/reservas" className={styles.topbarLink}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
            <span>Reservas</span>
          </Link>
          <Link to="/" className={styles.topbarExit}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
            <span>Sair do painel</span>
          </Link>
        </div>
      </nav>

      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <p className={styles.pageSubtitle}>Visão geral do sistema de reservas</p>
        </div>

        {carregando ? (
          <p className={styles.loadingText}>Carregando dados…</p>
        ) : (
          <>
            <div className={styles.statGrid}>
              {statCards.map((s) => (
                <div key={s.key} className={styles.statCard}>
                  <div className={styles.statIcon}>{s.icon}</div>
                  <div>
                    <div className={styles.statLabel}>{s.label}</div>
                    <div className={styles.statValue}>{s.value}</div>
                    <div className={styles.statDesc}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Acesso rápido</h2>
              </div>
              <div className={styles.quickAccess}>
                <Link to="/admin/mesas" className={styles.quickCard}>
                  <div className={styles.quickCardIcon}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" /></svg>
                  </div>
                  <div className={styles.quickCardText}>
                    <strong>Gerenciar Mesas</strong>
                    <span>Criar, editar, liberar e remover mesas</span>
                  </div>
                </Link>
                <Link to="/admin/reservas" className={styles.quickCard}>
                  <div className={styles.quickCardIcon}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                  </div>
                  <div className={styles.quickCardText}>
                    <strong>Ver Reservas</strong>
                    <span>Todas as reservas do sistema</span>
                  </div>
                </Link>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
