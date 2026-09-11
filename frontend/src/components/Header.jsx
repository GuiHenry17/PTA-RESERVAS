import { useState, useRef, useEffect } from "react";
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

function getIniciais(nome) {
  if (!nome) return "?";
  const partes = nome.trim().split(" ");
  if (partes.length === 1) return partes[0][0].toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const dropdownRef = useRef(null);

  const payload = getPayload();
  const isLogado = !!payload;
  const isAdmin = payload?.tipo === "admin";
  const nome = payload?.nome ?? "";
  const iniciais = getIniciais(nome);
  const primeiroNome = nome.trim().split(" ")[0];

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const fecharMenu = () => setMenuAberto(false);

  useEffect(() => {
    function handleClickFora(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownAberto(false);
      }
    }
    document.addEventListener("mousedown", handleClickFora);
    return () => document.removeEventListener("mousedown", handleClickFora);
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo} aria-label="Ir para a página inicial" onClick={fecharMenu}>
          <span className={styles.logoSub}>Restaurante</span>
          <span className={styles.logoName}>Volta &amp; Meia</span>
        </Link>

        <nav className={styles.nav} aria-label="Navegação principal">
          <Link to="/" className={styles.navLink}>Início</Link>
          <Link to="/cardapio" className={styles.navLink}>Cardápio</Link>
        </nav>

        <div className={styles.actions}>
          {isLogado ? (
            <div className={styles.userMenu} ref={dropdownRef}>
              <button
                className={styles.avatarBtn}
                onClick={() => setDropdownAberto((v) => !v)}
                aria-label="Menu do usuário"
                aria-expanded={dropdownAberto}
              >
                <div className={styles.avatar}>{iniciais}</div>
                <span className={styles.saudacao}>Olá, {primeiroNome}</span>
                <svg
                  className={`${styles.chevron} ${dropdownAberto ? styles.chevronAberto : ""}`}
                  width="14" height="14" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2.5"
                  aria-hidden="true"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {dropdownAberto && (
                <div className={styles.dropdown} role="menu">
                  <div className={styles.dropdownHeader}>
                    <div className={styles.avatarLg}>{iniciais}</div>
                    <div>
                      <div className={styles.dropdownNome}>{nome}</div>
                      <div className={styles.dropdownTipo}>{isAdmin ? "Administrador" : "Cliente"}</div>
                    </div>
                  </div>

                  <div className={styles.dropdownDivider} />

                  <Link
                    to="/reservas"
                    className={styles.dropdownItem}
                    onClick={() => setDropdownAberto(false)}
                    role="menuitem"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    Minhas Reservas
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      className={styles.dropdownItem}
                      onClick={() => setDropdownAberto(false)}
                      role="menuitem"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <rect x="3" y="3" width="7" height="7" rx="1" />
                        <rect x="14" y="3" width="7" height="7" rx="1" />
                        <rect x="3" y="14" width="7" height="7" rx="1" />
                        <rect x="14" y="14" width="7" height="7" rx="1" />
                      </svg>
                      Painel Admin
                    </Link>
                  )}

                  <div className={styles.dropdownDivider} />

                  <button
                    className={`${styles.dropdownItem} ${styles.dropdownItemLogout}`}
                    onClick={() => { setDropdownAberto(false); handleLogout(); }}
                    role="menuitem"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className={styles.loginBtn}>Entrar</Link>
              <Link to="/cadastro" className={styles.cadastroBtn}>Criar conta</Link>
            </>
          )}

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
                <div className={styles.mobileUserInfo}>
                  <div className={styles.avatarSm}>{iniciais}</div>
                  <div>
                    <div className={styles.mobileUserNome}>{nome}</div>
                    <div className={styles.mobileUserTipo}>{isAdmin ? "Administrador" : "Cliente"}</div>
                  </div>
                </div>
                <Link to="/reservas" className={styles.mobileNavLink} onClick={fecharMenu}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                  Minhas Reservas
                </Link>
                {isAdmin && (
                  <Link to="/admin" className={styles.mobileNavLink} onClick={fecharMenu}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
                    Painel Admin
                  </Link>
                )}
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
