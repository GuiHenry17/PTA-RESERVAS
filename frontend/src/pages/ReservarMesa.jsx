import { useEffect, useRef, useState } from "react";
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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const agora = new Date();
  agora.setMinutes(agora.getMinutes() - agora.getTimezoneOffset());
  const minDate = agora.toISOString().slice(0, 16);

  const umAnoDepois = new Date(agora);
  umAnoDepois.setFullYear(umAnoDepois.getFullYear() + 1);
  const maxDate = umAnoDepois.toISOString().slice(0, 16);

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

    const dataEscolhida = new Date(data);
    const agora = new Date();
    if (dataEscolhida <= agora) {
      setErro("A data da reserva deve ser no futuro.");
      return;
    }
    const limite = new Date();
    limite.setFullYear(limite.getFullYear() + 1);
    if (dataEscolhida > limite) {
      setErro("Não é possível reservar com mais de 1 ano de antecedência.");
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
            <p className={styles.pageSubtitle}>Escolha a mesa, a data e o horário desejados</p>
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
                  <label className={styles.label} htmlFor="mesa">Mesa disponível</label>
                  <div
                    ref={dropdownRef}
                    className={`${styles.dropdown} ${dropdownOpen ? styles.dropdownOpen : ""} ${enviando ? styles.dropdownDisabled : ""}`}
                  >
                    <button
                      id="mesa"
                      type="button"
                      className={styles.dropdownTrigger}
                      onClick={() => !enviando && setDropdownOpen((o) => !o)}
                      aria-haspopup="listbox"
                      aria-expanded={dropdownOpen}
                      disabled={enviando}
                    >
                      <span className={mesaId ? styles.dropdownValueSelected : styles.dropdownPlaceholder}>
                        {mesaId
                          ? (() => { const m = mesas.find((m) => m.id === Number(mesaId)); return m ? `Mesa ${m.codigo} — ${m.n_lugares} ${m.n_lugares === 1 ? "lugar" : "lugares"}` : "Selecione uma mesa…"; })()
                          : "Selecione uma mesa…"}
                      </span>
                      <svg
                        className={styles.dropdownChevron}
                        width="16" height="16" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="2.5"
                        aria-hidden="true"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>

                    {dropdownOpen && (
                      <ul className={styles.dropdownList} role="listbox" aria-label="Mesas disponíveis">
                        {mesas.map((m) => (
                          <li
                            key={m.id}
                            role="option"
                            aria-selected={mesaId === String(m.id)}
                            className={`${styles.dropdownOption} ${mesaId === String(m.id) ? styles.dropdownOptionSelected : ""}`}
                            onClick={() => {
                              setMesaId(String(m.id));
                              setNPessoas("");
                              setDropdownOpen(false);
                            }}
                          >
                            <span className={styles.dropdownOptionLabel}>
                              Mesa {m.codigo}
                            </span>
                            <span className={styles.dropdownOptionMeta}>
                              {m.n_lugares} {m.n_lugares === 1 ? "lugar" : "lugares"}
                            </span>
                            {mesaId === String(m.id) && (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.dropdownOptionCheck} aria-hidden="true">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {mesaSelecionada && (
                    <div className={styles.mesaInfo}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                        <circle cx="12" cy="12" r="10" /><polyline points="9 12 11 14 15 10" />
                      </svg>
                      Mesa {mesaSelecionada.codigo} · {mesaSelecionada.n_lugares} {mesaSelecionada.n_lugares === 1 ? "lugar" : "lugares"}
                    </div>
                  )}
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="data">Data e horário</label>
                  <input
                    id="data"
                    type="datetime-local"
                    className={styles.input}
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    min={minDate}
                    max={maxDate}
                    required
                    disabled={enviando}
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="nPessoas">
                    Número de pessoas
                    {mesaSelecionada && (
                      <span style={{ fontWeight: 400, color: "var(--color-text-muted)", marginLeft: "var(--space-2)" }}>
                        máx. {mesaSelecionada.n_lugares}
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

                <hr className={styles.divider} />

                <button type="submit" className={styles.submitBtn} disabled={enviando}>
                  {enviando ? (
                    "Confirmando…"
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
