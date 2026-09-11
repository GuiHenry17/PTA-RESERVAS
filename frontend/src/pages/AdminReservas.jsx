import { useEffect, useState, useCallback } from "react";
import styles from "../styles/Admin.module.css";
import Footer from "../components/Footer";
import AdminNav from "../components/AdminNav";
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
  const [filtroData, setFiltroData] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const carregarReservas = useCallback(async () => {
    setCarregando(true);
    setErro("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/reservas/todas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.erro) setErro(json.mensagem || "Erro ao carregar reservas.");
      else setReservas(json.reservas || []);
    } catch {
      setErro("Erro de conexão com o servidor.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarReservas();
  }, [carregarReservas]);

  const reservasFiltradas = reservas.filter((r) => {
    const matchStatus =
      filtroStatus === "todas" ||
      (filtroStatus === "ativa" && r.status === true) ||
      (filtroStatus === "cancelada" && r.status === false);

    if (!matchStatus) return false;

    if (filtroData) {
      const dataReserva = new Date(r.data);
      const ano = dataReserva.getFullYear();
      const mes = String(dataReserva.getMonth() + 1).padStart(2, "0");
      const dia = String(dataReserva.getDate()).padStart(2, "0");
      if (`${ano}-${mes}-${dia}` !== filtroData) return false;
    }

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
      <AdminNav />

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

              <input
                type="date"
                className={styles.searchInput}
                value={filtroData}
                onChange={(e) => setFiltroData(e.target.value)}
                aria-label="Filtrar por data"
                title="Filtrar por data"
              />

              {filtroData && (
                <button
                  onClick={() => setFiltroData("")}
                  style={{
                    padding: "4px 10px",
                    borderRadius: "var(--radius-full)",
                    border: "1.5px solid var(--color-border)",
                    background: "none",
                    color: "var(--color-text-secondary)",
                    fontSize: "var(--font-size-xs)",
                    cursor: "pointer",
                  }}
                >
                  Limpar data
                </button>
              )}

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
