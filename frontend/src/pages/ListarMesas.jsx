import { useEffect, useState } from "react";
import styles from "../styles/ListarMesas.module.css";

export default function ListarMesas() {
    const [mesas, setMesas] = useState([]);
    const [filtro, setFiltro] = useState("");
    const [statusFiltro, setStatusFiltro] = useState("");
    const [error, setError] = useState("");
    const [editando, setEditando] = useState(null);
    const [codigoEdit, setCodigoEdit] = useState("");
    const [nLugaresEdit, setNLugaresEdit] = useState("");
    const [statusEdit, setStatusEdit] = useState("");

    useEffect(() => {
        buscarMesas();
    }, []);

    const buscarMesas = async () => {
        try {
            const response = await fetch("http://localhost:3000/mesas");
            const data = await response.json();

            if (!data.erro) {
                setMesas(data.mesas);
            } else {
                setError(data.mensagem || "Erro ao buscar mesas");
            }
        } catch {
            setError("Erro de conexão com o servidor");
        }
    };

    const handleLimpar = () => {
        setFiltro("");
        setStatusFiltro("");
        buscarMesas();
    };

    const handleEditar = (mesa) => {
        setEditando(mesa.id);
        setCodigoEdit(mesa.codigo);
        setNLugaresEdit(mesa.n_lugares);
        setStatusEdit(mesa.status || "disponível");
    };

    const handleCancelar = () => {
        setEditando(null);
        setCodigoEdit("");
        setNLugaresEdit("");
        setStatusEdit("");
    };

    const handleSalvar = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:3000/mesas/${editando}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    codigo: codigoEdit,
                    n_lugares: Number(nLugaresEdit),
                    status: statusEdit,
                }),
            });

            const data = await response.json();

            if (!data.erro) {
                await buscarMesas();
                setEditando(null);
            } else {
                setError(data.mensagem || "Erro ao atualizar mesa");
            }
        } catch {
            setError("Erro de conexão com o servidor");
        }
    };

    const handleRemover = async (id) => {
        if (!window.confirm("Tem certeza que deseja remover esta mesa?")) return;

        try {
            const response = await fetch(`http://localhost:3000/mesas/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });

            const data = await response.json();

            if (!data.erro) {
                await buscarMesas();
                alert("Mesa removida com sucesso!");
            } else {
                setError(data.mensagem || "Erro ao remover mesa");
            }
        } catch {
            setError("Erro de conexão com o servidor");
        }
    };

    const mesasFiltradas = mesas.filter((mesa) => {
        const codigoOk = mesa.codigo.toLowerCase().includes(filtro.toLowerCase());
        const statusOk = statusFiltro ? mesa.status === statusFiltro : true;
        return codigoOk && statusOk;
    });

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h2>Consultar Mesas</h2>

                {error && <p className={styles.error}>{error}</p>}

                <div className={styles.filters}>
                    <input
                        type="text"
                        placeholder="Buscar por código..."
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                        className={styles.input}
                    />

                    <select
                        value={statusFiltro}
                        onChange={(e) => setStatusFiltro(e.target.value)}
                        className={styles.select}
                    >
                        <option value="">Todos os status</option>
                        <option value="disponível">Disponível</option>
                        <option value="ocupada">Ocupada</option>
                        <option value="reservada">Reservada</option>
                    </select>

                    <button onClick={handleLimpar} className={styles.clearButton}>
                        LIMPAR
                    </button>
                </div>

                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Status</th>
                            <th>Capacidade</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mesasFiltradas.length > 0 ? (
                            mesasFiltradas.map((mesa) =>
                                editando === mesa.id ? (
                                    <tr key={mesa.id}>
                                        <td>
                                            <input
                                                type="text"
                                                value={codigoEdit}
                                                onChange={(e) => setCodigoEdit(e.target.value)}
                                                className={styles.inputSmall}
                                            />
                                        </td>
                                        <td>
                                            <select
                                                value={statusEdit}
                                                onChange={(e) => setStatusEdit(e.target.value)}
                                                className={styles.selectSmall}
                                            >
                                                <option value="disponível">Disponível</option>
                                                <option value="ocupada">Ocupada</option>
                                                <option value="reservada">Reservada</option>
                                            </select>
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                value={nLugaresEdit}
                                                onChange={(e) => setNLugaresEdit(e.target.value)}
                                                className={styles.inputSmall}
                                            />
                                        </td>
                                        <td>
                                            <button
                                                className={styles.saveButton}
                                                onClick={handleSalvar}
                                            >
                                                SALVAR
                                            </button>
                                            <button
                                                className={styles.cancelButton}
                                                onClick={handleCancelar}
                                            >
                                                CANCELAR
                                            </button>
                                        </td>
                                    </tr>
                                ) : (
                                    <tr key={mesa.id}>
                                        <td>{mesa.codigo}</td>
                                        <td>{mesa.status || "N/A"}</td>
                                        <td>{mesa.n_lugares}</td>
                                        <td>
                                            <button
                                                className={styles.editButton}
                                                onClick={() => handleEditar(mesa)}
                                            >
                                                EDITAR
                                            </button>
                                            <button
                                                className={styles.deleteButton}
                                                onClick={() => handleRemover(mesa.id)}
                                            >
                                                REMOVER
                                            </button>
                                        </td>
                                    </tr>
                                )
                            )
                        ) : (
                            <tr>
                                <td colSpan="4">Nenhuma mesa encontrada</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
