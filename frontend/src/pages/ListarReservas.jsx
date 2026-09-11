import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "../styles/ListarReservas.module.css";
import API_URL from "../utils/api";

const FILTROS = [
  { label: "Todas", value: "todas" },
  { label: "Ativas", value: "ativa" },
  { label: "Canceladas", value: "cancelada" },
];

function formatarData(iso) {
  return new Date(iso).toLocaleString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ListarReservas() {
  const [reservas, setReservas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [filtro, setFiltro] = useState("todas");
  const [cancelando, setCancelando] = useState(null);

  const carregarReservas = useCallback(async () => {
    setErro("");
    setCarregando(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/reservas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dados = await res.json();
      if (dados.erro) {
        setErro(dados.mensagem || "Erro ao carregar reservas.");
      } else {
        setReservas(Array.isArray(dados.reservas) ? dados.reservas : []);
      }
    } catch {
      setErro("Erro de conexão com o servidor.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarReservas();
  }, [carregarReservas]);

  async function cancelarReserva(reservaId) {
    if (!window.confirm("Deseja cancelar esta reserva?")) return;

    setCancelando(reservaId);
    setErro("");
    setSucesso("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/reservas`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reservaId }),
      });

      const dados = await res.json();

      if (dados.erro) {
        setErro(dados.mensagem || "Erro ao cancelar reserva.");
      } else {
        setSucesso("Reserva cancelada com sucesso.");
        carregarReservas();
        setTimeout(() => setSucesso(""), 4000);
      }
    } catch {
      setErro("Erro de conexão com o servidor.");
    } finally {
      setCancelando(null);
    }
  }

  const reservasFiltradas = reservas.filter((r) => {
    if (filtro === "ativa") return r.status === true;
    if (filtro === "cancelada") return r.status === false;
    return true;
  });

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Minhas Reservas</h1>
          <p className={styles.pageSubtitle}>
            Gerencie suas reservas no Volta &amp; Meia
          </p>
        </div>

        {/* Ações */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "var(--space-4)", marginBottom: "var(--space-4)" }}>
          <div className={styles.filters} style={{ marginBottom: 0 }}>
            {FILTROS.map((f) => (
              <button
                key={f.value}
                className={`${styles.filterBtn} ${filtro === f.value ? styles.filterBtnActive : ""}`}
                onClick={() => setFiltro(f.value)}
              >
                {f.label}
                {f.value !== "todas" && (
                  <span style={{ marginLeft: "var(--space-1)", opacity: 0.8 }}>
                    ({reservas.filter((r) => (f.value === "ativa" ? r.status : !r.status)).length})
                  </span>
                )}
              </button>
            ))}
          </div>
          <Link to="/reservar" style={{ textDecoration: "none" }}>
            <button className={styles.loadBtn} style={{ margin: 0 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Nova Reserva
            </button>
          </Link>
        </div>

        {/* Feedback */}
        {erro && (
          <div className={styles.alertErro} role="alert">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {erro}
          </div>
        )}
        {sucesso && (
          <div className={styles.alertSucesso} role="status">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10" /><polyline points="9 12 11 14 15 10" />
            </svg>
            {sucesso}
          </div>
        )}

        {/* Lista */}
        {carregando ? (
          <div style={{ textAlign: "center", padding: "var(--space-12)", color: "var(--color-text-muted)" }}>
            Carregando reservas…
          </div>
        ) : reservasFiltradas.length === 0 ? (
          <div className={styles.emptyState}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="1.5" style={{ margin: "0 auto var(--space-4)" }} aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <h3>
              {filtro === "todas" ? "Nenhuma reserva encontrada" : `Nenhuma reserva ${filtro}`}
            </h3>
            <p>
              {filtro === "todas"
                ? "Você ainda não fez nenhuma reserva."
                : "Tente outro filtro."}
            </p>
          </div>
        ) : (
          <div className={styles.reservasList}>
            {reservasFiltradas.map((r) => (
              <article
                key={r.id}
                className={`${styles.reservaCard} ${!r.status ? styles.reservaCardCancelada : ""}`}
                aria-label={`Reserva ${r.id} — Mesa ${r.mesa?.codigo}`}
              >
                <div className={`${styles.reservaIcon} ${!r.status ? styles.reservaIconCancelada : ""}`} aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>

                <div className={styles.reservaInfo}>
                  <div className={styles.reservaMesa}>
                    Mesa {r.mesa?.codigo ?? "—"}
                  </div>
                  <div className={styles.reservaDetalhes}>
                    <span>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                      </svg>
                      {formatarData(r.data)}
                    </span>
                    <span>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
                      </svg>
                      {r.n_pessoas} {r.n_pessoas === 1 ? "pessoa" : "pessoas"}
                    </span>
                  </div>
                </div>

                <span className={`${styles.badge} ${r.status ? styles.badgeAtiva : styles.badgeCancelada}`}>
                  {r.status ? "Ativa" : "Cancelada"}
                </span>

                {r.status && (
                  <button
                    className={styles.cancelBtn}
                    onClick={() => cancelarReserva(r.id)}
                    disabled={cancelando === r.id}
                    aria-label={`Cancelar reserva da Mesa ${r.mesa?.codigo}`}
                  >
                    {cancelando === r.id ? "Cancelando…" : "Cancelar"}
                  </button>
                )}
              </article>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
