import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/Header.module.css";

function getPayload() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    const agora = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < agora) return null;
    return payload;
  } catch {
    return null;
  }
}

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false);
  const payload = getPayload();
  const isLogado = !!payload;
  const isAdmin = payload?.tipo === "admin";

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const fecharMenu = () => setMenuAberto(false);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo} aria-label="Ir para a página inicial" onClick={fecharMenu}>
          <span className={styles.logoSub}>Restaurante</span>
          <span className={styles.logoName}>do Joilço</span>
        </Link>

        {/* Nav desktop */}
        <nav className={styles.nav} aria-label="Navegação principal">
          <Link to="/" className={styles.navLink}>Início</Link>
          <Link to="/cardapio" className={styles.navLink}>Cardápio</Link>
          {!isLogado && (
            <>
              <Link to="/login" className={styles.navLink}>Entrar</Link>
              <Link to="/cadastro" className={styles.navLink}>Cadastro</Link>
            </>
          )}
        </nav>

        <div className={styles.actions}>
          {isLogado && (
            <>
              {isAdmin && (
                <Link to="/admin" className={styles.adminBtn}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                  </svg>
                  <span>Painel Admin</span>
                </Link>
              )}

              <Link to="/reservas" className={styles.reservasBtn}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>Minhas Reservas</span>
              </Link>

              <button className={styles.logoutBtn} onClick={handleLogout} aria-label="Sair da conta">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>Sair</span>
              </button>
            </>
          )}

          {!isLogado && (
            <>
              <Link to="/login" className={styles.loginBtnMobile}>Entrar</Link>
            </>
          )}

          {/* Botão hamburger */}
          <button
            className={styles.hamburger}
            onClick={() => setMenuAberto((v) => !v)}
            aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuAberto}
          >
            {menuAberto ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Drawer mobile */}
      {menuAberto && (
        <div className={styles.mobileMenu} aria-label="Menu mobile">
          <nav className={styles.mobileNav}>
            <Link to="/" className={styles.mobileNavLink} onClick={fecharMenu}>Início</Link>
            <Link to="/cardapio" className={styles.mobileNavLink} onClick={fecharMenu}>Cardápio</Link>
            {!isLogado ? (
              <>
                <Link to="/login" className={styles.mobileNavLink} onClick={fecharMenu}>Entrar</Link>
                <Link to="/cadastro" className={`${styles.mobileNavLink} ${styles.mobileNavLinkPrimary}`} onClick={fecharMenu}>Criar conta</Link>
              </>
            ) : (
              <>
                {isAdmin && (
                  <Link to="/admin" className={styles.mobileNavLink} onClick={fecharMenu}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
                    Painel Admin
                  </Link>
                )}
                <Link to="/reservas" className={styles.mobileNavLink} onClick={fecharMenu}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                  Minhas Reservas
                </Link>
                <button className={`${styles.mobileNavLink} ${styles.mobileNavLinkLogout}`} onClick={() => { handleLogout(); fecharMenu(); }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                  Sair
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
