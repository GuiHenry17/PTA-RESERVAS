import { useEffect, useState } from "react";
import styles from "../styles/ReservarMesa.module.css";

export default function ReservarMesa() {
  const [mesas, setMesas] = useState([]);
  const [mesaId, setMesaId] = useState("");
  const [data, setData] = useState("");
  const [nPessoas, setNPessoas] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    buscarMesas();
  }, []);

  async function buscarMesas() {
    try {
      const response = await fetch("http://localhost:3000/mesas");
      const result = await response.json();

      if (!result.erro) {
        const disponiveis = result.mesas.filter(
          (m) => m.status === "disponível"
        );
        setMesas(disponiveis);
      }
    } catch (err) {
      setError("Erro ao carregar mesas.");
    }
  }

  async function reservar(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Você precisa estar logado!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/reservas/novo", {
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

      const result = await response.json();

      if (result.erro) {
        setError(result.mensagem || "Erro ao criar a reserva.");
      } else {
        setSuccess("Reserva feita com sucesso!");
        setMesaId("");
        setData("");
        setNPessoas("");
        buscarMesas();
      }
    } catch (err) {
      setError("Erro ao conectar com o servidor.");
    }
  }

  const mesaSelecionada = mesas.find((m) => m.id === Number(mesaId));

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={reservar}>
        <h2>Reservar Mesa</h2>

        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}

        <label>Mesa</label>
        <select
          className={styles.select}
          value={mesaId}
          onChange={(e) => setMesaId(e.target.value)}
        >
          <option value="">Selecione uma mesa</option>
          {mesas.map((mesa) => (
            <option key={mesa.id} value={mesa.id}>
              Mesa {mesa.codigo} — {mesa.n_lugares} lugares
            </option>
          ))}
        </select>

        <label>Data</label>
        <input
          type="date"
          className={styles.input}
          value={data}
          onChange={(e) => setData(e.target.value)}
          required
        />

        <label>Número de Pessoas</label>
        <input
          type="number"
          className={styles.input}
          value={nPessoas}
          onChange={(e) => setNPessoas(e.target.value)}
          min="1"
          max={mesaSelecionada ? mesaSelecionada.n_lugares : 1}
          required
        />

        <button className={styles.button} type="submit">
          Reservar
        </button>
      </form>
    </div>
  );
}
