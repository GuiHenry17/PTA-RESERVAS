import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/Admin.module.css";
import Footer from "../components/Footer";
import API_URL from "../utils/api";

export default function AdminReservas() {
  const [reservas, setReservas] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    carregarReservas();
  }, []);

  async function carregarReservas() {
    setCarregando(true);
    setErro("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/reservas/todas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.erro) {
        setErro(data.mensagem || "Erro ao carregar reservas.");
      } else {
        setReservas(data.reservas || []);
      }
    } catch {
      setErro("Erro de conexão com o servidor.");
    } finally {
      setCarregando(false);
    }
  }

  const reservasFiltradas = filtro.trim()
    ? reservas.filter((r) => {
        const texto = filtro.toLowerCase();
        return (
          r.mesa?.codigo?.toLowerCase().includes(texto) ||
          r.usuario?.nome?.toLowerCase().includes(texto) ||
          r.usuario?.email?.toLowerCase().includes(texto)
        );
      })
    : reservas;

  function formatarData(iso) {
    return new Date(iso).toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  }

  return (
    <div className={styles.pagina}>
      <div className={styles.topo}>
        <div>
          <h1>Todas as Reservas</h1>
          <p>Visualize todas as reservas registradas no sistema</p>
        </div>
        <nav className={styles.navAdmin}>
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/mesas">Mesas</Link>
          <Link to="/admin/reservas" className={styles.ativo}>Reservas</Link>
          <Link to="/">← Site</Link>
        </nav>
      </div>

      <div className={styles.conteudo}>
        <div className={styles.secao}>
          <h2>Reservas ({reservasFiltradas.length})</h2>

          {/* Filtro de busca */}
          <div style={{ marginBottom: "16px" }}>
            <input
              className={styles.input}
              style={{ maxWidth: "360px" }}
              placeholder="Buscar por mesa, cliente ou e-mail..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
          </div>

          {erro && <p className={styles.erro}>{erro}</p>}

          {carregando ? (
            <p className={styles.carregando}>Carregando reservas...</p>
          ) : reservasFiltradas.length === 0 ? (
            <p className={styles.vazio}>Nenhuma reserva encontrada.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table className={styles.tabela}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Mesa</th>
                    <th>Cliente</th>
                    <th>E-mail</th>
                    <th>Data</th>
                    <th>Pessoas</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reservasFiltradas.map((r) => (
                    <tr key={r.id}>
                      <td>{r.id}</td>
                      <td><strong>{r.mesa?.codigo ?? "—"}</strong></td>
                      <td>{r.usuario?.nome} {r.usuario?.sobrenome}</td>
                      <td>{r.usuario?.email}</td>
                      <td>{formatarData(r.data)}</td>
                      <td>{r.n_pessoas}</td>
                      <td>
                        <span className={
                          r.status
                            ? `${styles.badge} ${styles.badgeDisponivel}`
                            : `${styles.badge} ${styles.badgeReservada}`
                        }>
                          {r.status ? "ativa" : "cancelada"}
                        </span>
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
