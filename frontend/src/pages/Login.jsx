import { useState } from "react";
import styles from "../styles/Login.module.css";

export default function Login() {
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")

    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: senha }),
      })

      const data = await response.json()

      if (data.token) {
        localStorage.setItem("token", data.token)
        window.location.href = "/"
      } else {
        setError(data.msg || "Erro ao fazer login")
      }
    } catch (err) {
      setError("Erro de conexão com o servidor")
    }
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleLogin} className={styles.form}>
        <h2>Login</h2>
        {error && <p className={styles.error}>{error}</p>}

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
          Entrar
        </button>
      </form>
    </div>
  )
}
