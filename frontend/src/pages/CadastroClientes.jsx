import { useState, useEffect } from "react";
import styles from "../styles/CadastroCliente.module.css";
import Footer from "../components/Footer";
import VoltarHome from "../components/Voltar";

export default function CadastroCliente() {
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [popup, setPopup] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setPopup(true);

      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    }
  }, []);

  const handleCadastro = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:3000/auth/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          sobrenome,
          estado,
          cidade,
          bairro,
          rua,
          numero,
          email,
          password: senha,
        }),
      });

      const data = await response.json();

      if (!data.erro) {
        setSuccess(data.mensagem || "Usuário cadastrado com sucesso!");
      } else {
        setError(data.mensagem || "Erro ao cadastrar usuário.");
      }

      try {
        const response = await fetch("http://localhost:3000/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password: senha }),
        });

        const data = await response.json();

        if (data.token) {
          localStorage.setItem("token", data.token);
          window.location.href = "/";
        } else {
          setError(data.msg || "Erro ao fazer login");
        }
      } catch (err) {
        setError("Erro de conexão com o servidor");
      }
    } catch (err) {
      setError("Erro de conexão com o servidor.");
      console.log(err);
    }
  };

  return (
    <div className={styles.container}>
      {popup && (
        <div className={styles["popup-overlay"]}>
          <div className={styles["popup-center"]}>
            <h3>Você já está logado!</h3>
            <p>Redirecionando para a página inicial...</p>
          </div>
        </div>
      )}
      <VoltarHome/>
      <form className={styles.form} onSubmit={handleCadastro}>
        <h2 className={styles.title}>Cadastro de Usuário</h2>

        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}

        <div className={styles.group}>
          <input
            type="text"
            placeholder="Nome"
            name="Nome"
            className={styles.input}
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Sobrenome"
            name="sobrenome"
            className={styles.input}
            value={sobrenome}
            onChange={(e) => setSobrenome(e.target.value)}
            required
          />
        </div>

        <div className={styles.group}>
          <input
            type="text"
            placeholder="Estado"
            name="estado"
            className={styles.input}
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Cidade"
            name="cidade"
            className={styles.input}
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            required
          />
        </div>

        <input
          type="text"
          placeholder="Bairro"
          name="bairro"
          className={styles.input}
          value={bairro}
          onChange={(e) => setBairro(e.target.value)}
          required
        />

        <div className={styles.group}>
          <input
            type="text"
            placeholder="Rua"
            name="rua"
            className={styles.input}
            value={rua}
            onChange={(e) => setRua(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Nº"
            name="numero"
            className={styles.input}
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            required
          />
        </div>

        <input
          type="email"
          placeholder="E-mail"
          name="email"
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Senha"
          name="senha"
          className={styles.input}
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        <button className={styles.button} type="submit">
          Cadastrar
        </button>
      </form>
      <Footer />
    </div>
  );
}
