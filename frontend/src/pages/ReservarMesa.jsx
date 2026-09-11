import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "../styles/ReservarMesa.module.css";
import API_URL from "../utils/api";

export default function ReservarMesa() {
  const [mesas, setMesas] = useState([]);
  const [carregandoMesas, setCarregandoMesas] = useState(true);
  const [mesaId, setMesaId] = useState("");
  const [data, setData] = useState("");
  const [nPessoas, setNPessoas] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();

  const agora = new Date();
  agora.setMinutes(agora.getMinutes() - agora.getTimezoneOffset());
  const minDate = agora.toISOString().slice(0, 16);

  useEffect(() => {
    carregarMesas();

    const handleFocus = () => carregarMesas();
    document.addEventListener("visibilitychange", handleFocus);
    return () => document.removeEventListener("visibilitychange", handleFocus);
  }, []);

  async function carregarMesas() {
    setCarregandoMesas(true);
    try {
      const res = await fetch(`${API_URL}/mesas`);
      const result = await res.json();
      if (!result.erro) {
        setMesas(result.mesas.filter((m) => m.status === "disponível"));
      }
    } catch {
      setErro("Erro ao carregar mesas disponíveis.");
    } finally {
      setCarregandoMesas(false);
    }
  }

  const mesaSelecionada = mesas.find((m) => m.id === Number(mesaId));

  async function reservar(e) {
    e.preventDefault();
    setErro("");
    setSucesso("");

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    if (!mesaId) {
      setErro("Selecione uma mesa.");
      return;
    }

    setEnviando(true);
    try {
      const res = await fetch(`${API_URL}/reservas/novo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mesaId: Number(mesaId),
          data,
          n_pessoas: Number(nPessoas),
        }),
      });

      const result = await res.json();

      if (result.erro) {
        setErro(result.mensagem || "Não foi possível criar a reserva.");
      } else {
        setSucesso(`Reserva confirmada! Mesa ${result.reserva?.mesa?.codigo ?? ""} reservada com sucesso.`);
        setMesaId("");
        setData("");
        setNPessoas("");
        carregarMesas();
      }
    } catch {
      setErro("Erro de conexão com o servidor.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Reservar Mesa</h1>
            <p className={styles.pageSubtitle}>
              Escolha a mesa, a data e o horário desejados
            </p>
          </div>

          {carregandoMesas ? (
            <div className={styles.formCard} style={{ textAlign: "center", color: "var(--color-text-muted)", padding: "var(--space-12)" }}>
              Carregando mesas disponíveis…
            </div>
          ) : mesas.length === 0 ? (
            <div className={styles.emptyState}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="1.5" style={{ margin: "0 auto var(--space-4)" }} aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <h3>Nenhuma mesa disponível</h3>
              <p>No momento todas as mesas estão reservadas ou inativas. Tente novamente mais tarde.</p>
            </div>
          ) : (
            <div className={styles.formCard}>
              <form className={styles.form} onSubmit={reservar} noValidate>
                {erro && (
                  <div className={styles.alertErro} role="alert">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" style={{ flexShrink: 0, marginTop: 1 }}>
                      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {erro}
                  </div>
                )}
                {sucesso && (
                  <div className={styles.alertSucesso} role="status">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" style={{ flexShrink: 0, marginTop: 1 }}>
                      <circle cx="12" cy="12" r="10" /><polyline points="9 12 11 14 15 10" />
                    </svg>
                    {sucesso}
                  </div>
                )}

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="mesa">Mesa disponível *</label>
                  <div className={styles.selectWrap}>
                    <select
                      id="mesa"
                      className={styles.select}
                      value={mesaId}
                      onChange={(e) => { setMesaId(e.target.value); setNPessoas(""); }}
                      required
                      disabled={enviando}
                    >
                      <option value="" disabled>Selecione uma mesa…</option>
                      {mesas.map((m) => (
                        <option key={m.id} value={m.id}>
                          Mesa {m.codigo} — {m.n_lugares} {m.n_lugares === 1 ? "lugar" : "lugares"}
                        </option>
                      ))}
                    </select>
                  </div>
                  {mesaSelecionada && (
                    <div className={styles.mesaInfo}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <circle cx="12" cy="12" r="10" /><polyline points="9 12 11 14 15 10" />
                      </svg>
                      Mesa {mesaSelecionada.codigo} selecionada · capacidade para {mesaSelecionada.n_lugares} {mesaSelecionada.n_lugares === 1 ? "pessoa" : "pessoas"}
                    </div>
                  )}
                </div>

                <div className={styles.fieldRow}>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="data">Data e horário *</label>
                    <input
                      id="data"
                      type="datetime-local"
                      className={styles.input}
                      value={data}
                      onChange={(e) => setData(e.target.value)}
                      min={minDate}
                      required
                      disabled={enviando}
                    />
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="nPessoas">
                      Pessoas *
                      {mesaSelecionada && (
                        <span style={{ fontWeight: 400, color: "var(--color-text-muted)" }}>
                          (máx. {mesaSelecionada.n_lugares})
                        </span>
                      )}
                    </label>
                    <input
                      id="nPessoas"
                      type="number"
                      className={styles.input}
                      value={nPessoas}
                      onChange={(e) => setNPessoas(e.target.value)}
                      min={1}
                      max={mesaSelecionada ? mesaSelecionada.n_lugares : undefined}
                      required
                      disabled={enviando || !mesaId}
                      placeholder="Ex: 2"
                    />
                  </div>
                </div>

                <button type="submit" className={styles.submitBtn} disabled={enviando}>
                  {enviando ? (
                    <>Confirmando…</>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      Confirmar Reserva
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
