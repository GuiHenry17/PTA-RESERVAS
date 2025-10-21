import { useState } from "react";
import styles from "../styles/CadastroCliente.module.css";

export default function CadastroCliente() {
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleCadastro = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      const response = await fetch("http://localhost:3000/auth/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, password: senha }),
      })

      const data = await response.json()

      if (!data.erro) {
        setSuccess(data.mensagem || "Usuário cadastrado com sucesso!")
      } else {
        setError(data.mensagem || "Erro ao cadastrar usuário")
      }
    } catch (err) {
      setError("Erro de conexão com o servidor")
    }
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleCadastro} className={styles.form}>
        <h2>Cadastro de Usuário</h2>
        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}

        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          className={styles.input}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          Cadastrar
        </button>
      </form>
    </div>
  )
}
