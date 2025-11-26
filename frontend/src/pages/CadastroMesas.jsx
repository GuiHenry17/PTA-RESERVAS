import { useState } from "react";
import styles from "../styles/CadastroMesa.module.css";

export default function CadastroMesas() {
  const [codigo, setCodigo] = useState("");
  const [n_lugares, setNLugares] = useState("");
  const [status, setStatus] = useState("disponível");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:3000/mesas/novo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigo, n_lugares, status }),
      });

      const data = await response.json();

      if (!data.erro) {
        setSuccess(data.mensagem || "Mesa cadastrada com sucesso!");
        setCodigo("");
        setNLugares("");
        setStatus("disponível");
      } else {
        setError(data.mensagem || "Erro ao cadastrar mesa");
      }
    } catch {
      setError("Erro de conexão com o servidor");
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Cadastro de Mesa</h2>

        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}

        <input
          type="text"
          placeholder="Código da mesa"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          required
          className={styles.input}
        />

        <input
          type="number"
          placeholder="Capacidade (número de lugares)"
          value={n_lugares}
          onChange={(e) => setNLugares(e.target.value)}
          required
          className={styles.input}
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className={styles.select}
        >
          <option value="disponível">Disponível</option>
          <option value="ocupada">Ocupada</option>
          <option value="reservada">Reservada</option>
        </select>

        <button type="submit" className={styles.button}>
          Cadastrar
        </button>
      </form>
    </div>
  );
}
