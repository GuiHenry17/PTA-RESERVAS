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

  useEffect(() => {
    carregarMesas();
  }, []);

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

  function feedback(msg, tipo = "sucesso") {
    if (tipo === "sucesso") { setSucesso(msg); setErro(""); }
    else { setErro(msg); setSucesso(""); }
    setTimeout(() => { setSucesso(""); setErro(""); }, 4000);
  }

  function iniciarEdicao(mesa) {
    setEditandoId(mesa.id);
    setForm({ codigo: mesa.codigo, n_lugares: mesa.n_lugares, status: mesa.status });
    setErro("");
    setSucesso("");
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
      return feedback("Preencha todos os campos obrigatórios.", "erro");
    }
    if (Number(form.n_lugares) < 1) {
      return feedback("Número de lugares deve ser maior que zero.", "erro");
    }

    setSalvando(true);
    try {
      const token = localStorage.getItem("token");
      const url = editandoId
        ? `${API_URL}/mesas/${editandoId}`
        : `${API_URL}/mesas/novo`;
      const method = editandoId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          codigo: form.codigo.trim(),
          n_lugares: Number(form.n_lugares),
          status: form.status,
        }),
      });

      const data = await res.json();

      if (data.erro) {
        return feedback(data.mensagem || "Erro ao salvar mesa.", "erro");
      }

      feedback(editandoId ? "Mesa atualizada com sucesso!" : "Mesa cadastrada com sucesso!");
      setEditandoId(null);
      setForm(formVazio);
      carregarMesas();
    } catch {
      feedback("Erro de conexão com o servidor.", "erro");
    } finally {
      setSalvando(false);
    }
  }

  async function remover(id, codigo) {
    if (!window.confirm(`Remover a mesa "${codigo}"? Esta ação não pode ser desfeita.`)) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/mesas/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (data.erro) {
        return feedback(data.mensagem || "Erro ao remover mesa.", "erro");
      }

      feedback("Mesa removida com sucesso!");
      carregarMesas();
    } catch {
      feedback("Erro de conexão com o servidor.", "erro");
    }
  }

  return (
    <div className={styles.pagina}>
      <div className={styles.topo}>
        <div>
          <h1>Gerenciar Mesas</h1>
          <p>Cadastre, edite e remova mesas do restaurante</p>
        </div>
        <nav className={styles.navAdmin}>
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/mesas" className={styles.ativo}>Mesas</Link>
          <Link to="/admin/reservas">Reservas</Link>
          <Link to="/">← Site</Link>
        </nav>
      </div>

      <div className={styles.conteudo}>

        {/* ── Formulário ── */}
        <div className={styles.secao}>
          <h2>{editandoId ? "Editar Mesa" : "Nova Mesa"}</h2>

          {erro && <p className={styles.erro}>{erro}</p>}
          {sucesso && <p className={styles.sucesso}>{sucesso}</p>}

          <form className={styles.form} onSubmit={salvar}>
            <div className={styles.formRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Código da mesa *</label>
                <input
                  className={styles.input}
                  placeholder="Ex: 01, A1..."
                  value={form.codigo}
                  onChange={(e) => setForm({ ...form, codigo: e.target.value })}
                  maxLength={10}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Número de lugares *</label>
                <input
                  type="number"
                  className={styles.input}
                  placeholder="Ex: 4"
                  value={form.n_lugares}
                  min={1}
                  max={50}
                  onChange={(e) => setForm({ ...form, n_lugares: e.target.value })}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Status</label>
                <select
                  className={styles.select}
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  {STATUS_OPCOES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.acoes}>
              <button type="submit" className={styles.btnPrimario} disabled={salvando}>
                {salvando ? "Salvando..." : editandoId ? "Salvar alterações" : "Cadastrar mesa"}
              </button>
              {editandoId && (
                <button type="button" className={styles.btnSecundario} onClick={cancelarEdicao}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* ── Tabela ── */}
        <div className={styles.secao}>
          <h2>Mesas cadastradas ({mesas.length})</h2>

          {carregando ? (
            <p className={styles.carregando}>Carregando mesas...</p>
          ) : mesas.length === 0 ? (
            <p className={styles.vazio}>Nenhuma mesa cadastrada ainda.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table className={styles.tabela}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Código</th>
                    <th>Lugares</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {mesas.map((mesa) => (
                    <tr key={mesa.id}>
                      <td>{mesa.id}</td>
                      <td><strong>{mesa.codigo}</strong></td>
                      <td>{mesa.n_lugares}</td>
                      <td>
                        <span className={
                          mesa.status === "disponível"
                            ? `${styles.badge} ${styles.badgeDisponivel}`
                            : `${styles.badge} ${styles.badgeReservada}`
                        }>
                          {mesa.status}
                        </span>
                      </td>
                      <td>
                        <div className={styles.acoes}>
                          <button
                            className={styles.btnSecundario}
                            onClick={() => iniciarEdicao(mesa)}
                          >
                            Editar
                          </button>
                          <button
                            className={styles.btnPerigo}
                            onClick={() => remover(mesa.id, mesa.codigo)}
                          >
                            Remover
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
      <Footer />
    </div>
  );
}
