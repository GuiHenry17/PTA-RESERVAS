import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/FormPage.module.css";
import Footer from "../components/Footer";
import API_URL from "../utils/api";

export default function CadastroClientes() {
  const [form, setForm] = useState({
    nome: "", sobrenome: "", email: "", password: "",
  });
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

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleCadastro = async (e) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const res = await fetch(`${API_URL}/auth/cadastro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form }),
      });

      const data = await res.json();

      if (data.erro) {
        setErro(data.mensagem || "Erro ao cadastrar usuário.");
        return;
      }

      // Login automático após cadastro bem-sucedido
      if (data.token) {
        localStorage.setItem("token", data.token);
        navigate("/");
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
          <h1 className={styles.cardTitle}>Criar conta</h1>
          <p className={styles.cardSubtitle}>Preencha os dados para se cadastrar</p>

          <form className={styles.form} onSubmit={handleCadastro} noValidate>
            {erro && (
              <div className={styles.alertErro} role="alert">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" style={{ flexShrink: 0, marginTop: 1 }}>
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {erro}
              </div>
            )}

            <div className={styles.fieldGroup}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="nome">Nome *</label>
                <input
                  id="nome"
                  type="text"
                  className={styles.input}
                  placeholder="João"
                  value={form.nome}
                  onChange={set("nome")}
                  required
                  disabled={carregando}
                  autoComplete="given-name"
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="sobrenome">Sobrenome *</label>
                <input
                  id="sobrenome"
                  type="text"
                  className={styles.input}
                  placeholder="Silva"
                  value={form.sobrenome}
                  onChange={set("sobrenome")}
                  required
                  disabled={carregando}
                  autoComplete="family-name"
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="email">E-mail *</label>
              <input
                id="email"
                type="email"
                className={styles.input}
                placeholder="seu@email.com"
                value={form.email}
                onChange={set("email")}
                required
                disabled={carregando}
                autoComplete="email"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="password">
                Senha *{" "}
                <span style={{ fontWeight: 400, color: "var(--color-text-muted)", fontSize: "0.78rem" }}>
                  (mínimo 6 caracteres)
                </span>
              </label>
              <input
                id="password"
                type="password"
                className={styles.input}
                placeholder="••••••••"
                value={form.password}
                onChange={set("password")}
                required
                minLength={6}
                disabled={carregando}
                autoComplete="new-password"
              />
            </div>

            <button type="submit" className={styles.submitBtn} disabled={carregando}>
              {carregando ? "Criando conta…" : "Criar conta"}
            </button>
          </form>

          <p className={styles.link}>
            Já tem conta? <Link to="/login">Entrar</Link>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
