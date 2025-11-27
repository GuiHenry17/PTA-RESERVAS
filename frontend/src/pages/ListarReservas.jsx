import { useState } from "react";
import "../styles/ListarReservas.css";
import VoltarHome from "../components/Voltar";
import Footer from "../components/Footer";

export default function ListarReservas() {
  const [reservas, setReservas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const carregarReservas = async () => {
    setErro("");
    setCarregando(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setErro("Usuário não está logado.");
        setCarregando(false);
        return;
      }

      const response = await fetch("http://localhost:3000/reservas", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const dados = await response.json();

      const lista = Array.isArray(dados.reservas) ? dados.reservas : [];

      setReservas(lista);
    } catch (err) {
      console.error(err);
      setErro("Erro ao carregar reservas.");
    }

    setCarregando(false);
  };

  return (
    <div className="tela-fundo">
      <VoltarHome/>
      <div className="reservas-container">
        <h1 className="titulo">Minhas Reservas</h1>

        <button className="botao" onClick={carregarReservas}>
          {carregando ? "Carregando..." : "Listar Reservas"}
        </button>

        {erro && <p className="erro">{erro}</p>}

        {reservas.length > 0 ? (
          <table className="tabela">
            <thead>
              <tr>
                <th>Nº Reserva</th>
                <th>Mesa</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {reservas.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.mesa?.codigo ?? "—"}</td>
                  <td>
                    {(() => {
                      const d = new Date(r.data);
                      d.setHours(d.getHours());
                      return d.toLocaleString("pt-BR", {
                        dateStyle: "short",
                        timeStyle: "short",
                      });
                    })()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="nenhuma">Nenhuma reserva encontrada.</p>
        )}
      </div>
      <Footer/>
    </div>
  );
}
