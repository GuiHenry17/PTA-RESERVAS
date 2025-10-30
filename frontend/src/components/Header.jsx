import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "../styles/Header.module.css";

export default function Header() {
    const [usuarioNome, setUsuarioNome] = useState("Visitante");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            try {
                const user = JSON.parse(atob(token.split(".")[1]));
                if (user.nome) {
                    setUsuarioNome(user.nome);
                } else {
                    setUsuarioNome(`Usuário #${user.id}`);
                }
            } catch {
                setUsuarioNome("Usuário");
            }
        }
    }, []);

    return (
        <header className={styles.header}>
            <div className={styles.logoArea}>
                <h1 className={styles.logo}>PTA Reservas</h1>
            </div>

            <nav className={styles.nav}>
                <Link to="/perfil" className={styles.link}>
                    Perfil
                </Link>
                <Link to="/cadastro" className={styles.link}>
                    Cadastrar Usuário
                </Link>
                <Link to="/cadastro-mesa" className={styles.link}>
                    Cadastrar Mesa
                </Link>
                <Link to="/listar-mesas" className={styles.link}>
                    Consultar Mesas
                </Link>
            </nav>

            <div className={styles.userArea}>
                <p className={styles.userText}>Bem-vindo, {usuarioNome}</p>
            </div>
        </header>
    );
}
