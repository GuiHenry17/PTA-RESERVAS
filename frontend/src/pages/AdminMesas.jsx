import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/Admin.module.css";
import Footer from "../components/Footer";
import API_URL from "../utils/api";

const STATUS_OPCOES = ["disponível", "reservada", "inativa"];
const formVazio = { codigo: "", n_lugares: "", status: "disponível" };

export default function AdminMesas() {
  const [mesas, setMesas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [form, setForm] = useState(formVazio);
  const [editandoId, setEditandoId] = useState(null);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [liberando, setLiberando] = useState(null);

  useEffect(() => { carregarMesas(); }, []);

  async function carregarMesas() {
    setCarregando(true);
    try {
      const res = await fetch(`${API_URL}/mesas`);
      const data = await res.json();
      setMesas(data.mesas || []);
    } catch {
      setErro("Erro ao carregar mesas.");
    } finally {
      setCarregando(false);
    }
  }

  function exibirFeedback(msg, tipo = "sucesso") {
    if (tipo === "sucesso") { setSucesso(msg); setErro(""); }
    else { setErro(msg); setSucesso(""); }
    setTimeout(() => { setSucesso(""); setErro(""); }, 5000);
  }

  function iniciarEdicao(mesa) {
    setEditandoId(mesa.id);
    setForm({ codigo: mesa.codigo, n_lugares: String(mesa.n_lugares), status: mesa.status });
    setErro(""); setSucesso("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setForm(formVazio);
    setErro("");
  }

  async function salvar(e) {
    e.preventDefault();
    if (!form.codigo.trim() || !form.n_lugares) {
      return exibirFeedback("Preencha todos os campos obrigatórios.", "erro");
    }
    if (Number(form.n_lugares) < 1) {
      return exibirFeedback("Número de lugares deve ser maior que zero.", "erro");
    }

    setSalvando(true);
    try {
      const token = localStorage.getItem("token");
      const url = editandoId ? `${API_URL}/mesas/${editandoId}` : `${API_URL}/mesas/novo`;
      const method = editandoId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          codigo: form.codigo.trim(),
          n_lugares: Number(form.n_lugares),
          status: form.status,
        }),
      });

      const data = await res.json();
      if (data.erro) return exibirFeedback(data.mensagem || "Erro ao salvar mesa.", "erro");

      exibirFeedback(data.mensagem || (editandoId ? "Mesa atualizada!" : "Mesa cadastrada!"));
      setEditandoId(null);
      setForm(formVazio);
      carregarMesas();
    } catch {
      exibirFeedback("Erro de conexão com o servidor.", "erro");
    } finally {
      setSalvando(false);
    }
  }

  async function liberarMesa(mesa) {
    if (!window.confirm(`Liberar a mesa "${mesa.codigo}"?\nEsta ação cancelará a reserva ativa e a mesa ficará disponível novamente.`)) return;

    setLiberando(mesa.id);
    setErro(""); setSucesso("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/mesas/${mesa.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ codigo: mesa.codigo, n_lugares: mesa.n_lugares, status: "disponível" }),
      });
      const data = await res.json();
      if (data.erro) return exibirFeedback(data.mensagem || "Erro ao liberar mesa.", "erro");
      exibirFeedback(data.mensagem || "Mesa liberada com sucesso!");
      carregarMesas();
    } catch {
      exibirFeedback("Erro de conexão com o servidor.", "erro");
    } finally {
      setLiberando(null);
    }
  }

  async function remover(id, codigo) {
    if (!window.confirm(`Remover a mesa "${codigo}"?\nEsta ação é irreversível.`)) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/mesas/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.erro) return exibirFeedback(data.mensagem || "Erro ao remover mesa.", "erro");
      exibirFeedback("Mesa removida com sucesso!");
      carregarMesas();
    } catch {
      exibirFeedback("Erro de conexão com o servidor.", "erro");
    }
  }

  const badgeClass = (status) => {
    if (status === "disponível") return `${styles.badge} ${styles.badgeDisponivel}`;
    if (status === "reservada") return `${styles.badge} ${styles.badgeReservada}`;
    return `${styles.badge} ${styles.badgeInativa}`;
  };

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
          <Link to="/admin/mesas" className={`${styles.topbarLink} ${styles.topbarLinkAtivo}`}>
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
          <h1 className={styles.pageTitle}>Gerenciar Mesas</h1>
          <p className={styles.pageSubtitle}>Cadastre, edite, libere e remova mesas do restaurante</p>
        </div>

        {/* Formulário */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              {editandoId ? "Editar Mesa" : "Nova Mesa"}
            </h2>
          </div>

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

          <form className={styles.form} onSubmit={salvar} noValidate>
            <div className={styles.formRow}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="codigo">Código *</label>
                <input
                  id="codigo"
                  className={styles.input}
                  placeholder="Ex: 01, A1…"
                  value={form.codigo}
                  onChange={(e) => setForm({ ...form, codigo: e.target.value })}
                  maxLength={10}
                  disabled={salvando}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="n_lugares">Lugares *</label>
                <input
                  id="n_lugares"
                  type="number"
                  className={styles.input}
                  placeholder="Ex: 4"
                  value={form.n_lugares}
                  min={1}
                  max={50}
                  onChange={(e) => setForm({ ...form, n_lugares: e.target.value })}
                  disabled={salvando}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="status">Status</label>
                <select
                  id="status"
                  className={styles.select}
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  disabled={salvando}
                >
                  {STATUS_OPCOES.map((s) => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.formActions}>
              <button type="submit" className={styles.btnPrimary} disabled={salvando}>
                {salvando ? "Salvando…" : editandoId ? "Salvar alterações" : "Cadastrar mesa"}
              </button>
              {editandoId && (
                <button type="button" className={styles.btnSecondary} onClick={cancelarEdicao}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Tabela */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              Mesas cadastradas
              <span className={styles.sectionCount}>({mesas.length})</span>
            </h2>
          </div>

          {carregando ? (
            <p className={styles.loadingText}>Carregando mesas…</p>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table} aria-label="Lista de mesas">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Código</th>
                    <th scope="col">Lugares</th>
                    <th scope="col">Status</th>
                    <th scope="col">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {mesas.length === 0 ? (
                    <tr className={styles.emptyRow}>
                      <td colSpan={5}>Nenhuma mesa cadastrada.</td>
                    </tr>
                  ) : (
                    mesas.map((mesa) => (
                      <tr key={mesa.id}>
                        <td style={{ color: "var(--color-text-muted)", fontWeight: 500 }}>{mesa.id}</td>
                        <td><strong>{mesa.codigo}</strong></td>
                        <td>{mesa.n_lugares}</td>
                        <td>
                          <span className={badgeClass(mesa.status)}>
                            {mesa.status}
                          </span>
                        </td>
                        <td>
                          <div className={styles.cellActions}>
                            {/* Botão dedicado LIBERAR — aparece só para mesas reservadas */}
                            {mesa.status === "reservada" && (
                              <button
                                className={styles.btnLiberar}
                                onClick={() => liberarMesa(mesa)}
                                disabled={liberando === mesa.id}
                                aria-label={`Liberar mesa ${mesa.codigo}`}
                              >
                                {liberando === mesa.id ? (
                                  "Liberando…"
                                ) : (
                                  <>
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                                    </svg>
                                    Liberar
                                  </>
                                )}
                              </button>
                            )}
                            <button
                              className={styles.btnEdit}
                              onClick={() => iniciarEdicao(mesa)}
                              aria-label={`Editar mesa ${mesa.codigo}`}
                            >
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                              </svg>
                              Editar
                            </button>
                            <button
                              className={styles.btnDanger}
                              onClick={() => remover(mesa.id, mesa.codigo)}
                              aria-label={`Remover mesa ${mesa.codigo}`}
                            >
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                                <path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                              </svg>
                              Remover
                            </button>
                          </div>
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
