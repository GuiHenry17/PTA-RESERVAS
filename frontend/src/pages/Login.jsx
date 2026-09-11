import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/FormPage.module.css";
import Footer from "../components/Footer";
import API_URL from "../utils/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [jaLogado, setJaLogado] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setJaLogado(true);
      const t = setTimeout(() => navigate("/"), 2000);
      return () => clearTimeout(t);
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: senha }),
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        navigate("/");
      } else {
        setErro(data.mensagem || "Erro ao fazer login.");
      }
    } catch {
      setErro("Não foi possível conectar ao servidor. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className={styles.page}>
      {jaLogado && (
        <div className={styles.popupOverlay} role="alertdialog" aria-live="polite">
          <div className={styles.popupCard}>
            <h3>Você já está logado!</h3>
            <p>Redirecionando para a página inicial…</p>
          </div>
        </div>
      )}

      <button className={styles.backBtn} onClick={() => navigate("/")} aria-label="Voltar para a página inicial">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Voltar
      </button>

      <div className={styles.content}>
        <div className={styles.card}>
          <h1 className={styles.cardTitle}>Entrar</h1>
          <p className={styles.cardSubtitle}>Acesse sua conta para fazer reservas</p>

          <form className={styles.form} onSubmit={handleLogin} noValidate>
            {erro && (
              <div className={styles.alertErro} role="alert">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" style={{ flexShrink: 0, marginTop: 1 }}>
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {erro}
              </div>
            )}

            <div className={styles.field}>
              <label className={styles.label} htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                className={styles.input}
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                disabled={carregando}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="senha">Senha</label>
              <input
                id="senha"
                type="password"
                className={styles.input}
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                autoComplete="current-password"
                disabled={carregando}
              />
            </div>

            <button type="submit" className={styles.submitBtn} disabled={carregando}>
              {carregando ? "Entrando…" : "Entrar"}
            </button>
          </form>

          <p className={styles.link}>
            Não tem conta? <Link to="/cadastro">Criar conta</Link>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
