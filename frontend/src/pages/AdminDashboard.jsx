import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/Admin.module.css";
import Footer from "../components/Footer";
import API_URL from "../utils/api";

export default function AdminDashboard() {
  const [resumo, setResumo] = useState({ mesas: 0, disponiveis: 0, reservadas: 0, reservas: 0 });
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarResumo();
  }, []);

  async function carregarResumo() {
    try {
      const token = localStorage.getItem("token");
      const [resMesas, resReservas] = await Promise.all([
        fetch(`${API_URL}/mesas`),
        fetch(`${API_URL}/reservas/todas`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const dataMesas = await resMesas.json();
      const dataReservas = await resReservas.json();

      const mesas = dataMesas.mesas || [];
      const reservas = dataReservas.reservas || [];

      setResumo({
        mesas: mesas.length,
        disponiveis: mesas.filter((m) => m.status === "disponível").length,
        reservadas: mesas.filter((m) => m.status === "reservada").length,
        reservas: reservas.length,
      });
    } catch {
      // cards ficam zerados em caso de erro
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className={styles.pagina}>
      <div className={styles.topo}>
        <div>
          <h1>Painel Administrativo</h1>
          <p>Gerencie mesas e acompanhe as reservas do restaurante</p>
        </div>
        <nav className={styles.navAdmin}>
          <Link to="/admin" className={styles.ativo}>Dashboard</Link>
          <Link to="/admin/mesas">Mesas</Link>
          <Link to="/admin/reservas">Reservas</Link>
          <Link to="/">← Site</Link>
        </nav>
      </div>

      <div className={styles.conteudo}>
        {carregando ? (
          <p className={styles.carregando}>Carregando...</p>
        ) : (
          <div className={styles.cards}>
            <div className={styles.card}>
              <span>Total de Mesas</span>
              <strong>{resumo.mesas}</strong>
              <p>cadastradas no sistema</p>
            </div>
            <div className={styles.card}>
              <span>Disponíveis</span>
              <strong>{resumo.disponiveis}</strong>
              <p>prontas para reserva</p>
            </div>
            <div className={styles.card}>
              <span>Reservadas</span>
              <strong>{resumo.reservadas}</strong>
              <p>com reserva ativa</p>
            </div>
            <div className={styles.card}>
              <span>Total de Reservas</span>
              <strong>{resumo.reservas}</strong>
              <p>registradas no sistema</p>
            </div>
          </div>
        )}

        <div className={styles.secao}>
          <h2>Acesso rápido</h2>
          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
            <Link to="/admin/mesas">
              <button className={styles.btnPrimario}>Gerenciar Mesas</button>
            </Link>
            <Link to="/admin/reservas">
              <button className={styles.btnPrimario}>Ver Todas as Reservas</button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
