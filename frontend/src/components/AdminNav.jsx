import { Link, useLocation } from "react-router-dom";
import styles from "../styles/Admin.module.css";

export default function AdminNav() {
  const { pathname } = useLocation();

  const linkClass = (path) =>
    pathname === path
      ? `${styles.topbarLink} ${styles.topbarLinkAtivo}`
      : styles.topbarLink;

  return (
    <nav className={styles.topbar} aria-label="Navegação do painel admin">
      <div className={styles.topbarBrand}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
        <span>Painel Admin</span>
      </div>

      <div className={styles.topbarNav}>
        <Link to="/admin" className={linkClass("/admin")}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          <span>Dashboard</span>
        </Link>

        <Link to="/admin/mesas" className={linkClass("/admin/mesas")}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="2" />
          </svg>
          <span>Mesas</span>
        </Link>

        <Link to="/admin/reservas" className={linkClass("/admin/reservas")}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>Reservas</span>
        </Link>

        <Link to="/" className={styles.topbarExit}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>Sair do painel</span>
        </Link>
      </div>
    </nav>
  );
}
