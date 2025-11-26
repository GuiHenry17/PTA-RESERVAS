import { useState } from "react";
import "../styles/ListarReservas.css";

export default function ListarReservas() {
  const [reservas, setReservas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const carregarReservas = async () => {
    setErro("");
    setCarregando(true);

    try {
      const response = await fetch("http://localhost:3000/reservas");
      const dados = await response.json();

      const lista = Array.isArray(dados.reservas) ? dados.reservas : [];

      setReservas(lista);
    } catch {
      setErro("Erro ao carregar reservas.");
    }

    setCarregando(false);
  };

  return (
    <div className="tela-fundo">
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

                  {}
                  <td>{r.mesa?.id ?? "—"}</td>

                  {}
                  <td>
                    {(() => {
                      const d = new Date(r.data);
                      d.setHours(d.getHours() + 3); 
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
    </div>
  );
}