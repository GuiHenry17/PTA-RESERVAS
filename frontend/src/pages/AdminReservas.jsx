import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/Admin.module.css";
import Footer from "../components/Footer";
import API_URL from "../utils/api";

const FILTROS = [
  { label: "Todas", value: "todas" },
  { label: "Ativas", value: "ativa" },
  { label: "Canceladas", value: "cancelada" },
];

function formatarData(iso) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminReservas() {
  const [reservas, setReservas] = useState([]);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todas");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    (async () => {
      setCarregando(true);
      setErro("");
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/reservas/todas`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.erro) setErro(data.mensagem || "Erro ao carregar reservas.");
        else setReservas(data.reservas || []);
      } catch {
        setErro("Erro de conexão com o servidor.");
      } finally {
        setCarregando(false);
      }
    })();
  }, []);

  const reservasFiltradas = reservas.filter((r) => {
    const matchStatus =
      filtroStatus === "todas" ||
      (filtroStatus === "ativa" && r.status === true) ||
      (filtroStatus === "cancelada" && r.status === false);

    if (!matchStatus) return false;

    if (!busca.trim()) return true;
    const texto = busca.toLowerCase();
    return (
      r.mesa?.codigo?.toLowerCase().includes(texto) ||
      r.usuario?.nome?.toLowerCase().includes(texto) ||
      r.usuario?.sobrenome?.toLowerCase().includes(texto) ||
      r.usuario?.email?.toLowerCase().includes(texto)
    );
  });

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
          <Link to="/admin" className={styles.topbarLink}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
            <span>Dashboard</span>
          </Link>
          <Link to="/admin/mesas" className={styles.topbarLink}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" /></svg>
            <span>Mesas</span>
          </Link>
          <Link to="/admin/reservas" className={`${styles.topbarLink} ${styles.topbarLinkAtivo}`}>
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
          <h1 className={styles.pageTitle}>Todas as Reservas</h1>
          <p className={styles.pageSubtitle}>Histórico completo de reservas do restaurante</p>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              Reservas
              <span className={styles.sectionCount}>({reservasFiltradas.length} de {reservas.length})</span>
            </h2>
            <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", alignItems: "center" }}>
              {/* Filtro status */}
              <div style={{ display: "flex", gap: "var(--space-1)" }}>
                {FILTROS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setFiltroStatus(f.value)}
                    style={{
                      padding: "4px 12px",
                      borderRadius: "var(--radius-full)",
                      border: "1.5px solid",
                      borderColor: filtroStatus === f.value ? "var(--color-primary)" : "var(--color-border)",
                      background: filtroStatus === f.value ? "var(--color-primary)" : "none",
                      color: filtroStatus === f.value ? "#fff" : "var(--color-text-secondary)",
                      fontSize: "var(--font-size-xs)",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all var(--transition-fast)",
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              {/* Busca */}
              <input
                className={styles.searchInput}
                type="search"
                placeholder="Buscar mesa, cliente ou e-mail…"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                aria-label="Buscar reservas"
              />
            </div>
          </div>

          {erro && (
            <div className={styles.alertErro} role="alert">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {erro}
            </div>
          )}

          {carregando ? (
            <p className={styles.loadingText}>Carregando reservas…</p>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table} aria-label="Lista de reservas">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Mesa</th>
                    <th scope="col">Cliente</th>
                    <th scope="col">E-mail</th>
                    <th scope="col">Data</th>
                    <th scope="col">Pessoas</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reservasFiltradas.length === 0 ? (
                    <tr className={styles.emptyRow}>
                      <td colSpan={7}>Nenhuma reserva encontrada.</td>
                    </tr>
                  ) : (
                    reservasFiltradas.map((r) => (
                      <tr key={r.id} style={{ opacity: r.status ? 1 : 0.65 }}>
                        <td style={{ color: "var(--color-text-muted)", fontWeight: 500 }}>{r.id}</td>
                        <td><strong>{r.mesa?.codigo ?? "—"}</strong></td>
                        <td>{r.usuario?.nome} {r.usuario?.sobrenome}</td>
                        <td style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-xs)" }}>{r.usuario?.email}</td>
                        <td style={{ whiteSpace: "nowrap", fontSize: "var(--font-size-xs)" }}>{formatarData(r.data)}</td>
                        <td>{r.n_pessoas}</td>
                        <td>
                          <span className={`${styles.badge} ${r.status ? styles.badgeAtiva : styles.badgeCancelada}`}>
                            {r.status ? "Ativa" : "Cancelada"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
