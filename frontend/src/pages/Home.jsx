import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "../styles/Home.module.css";

export default function Home() {
    const navigate = useNavigate();

    return (
        <>
            <Header />
            <div className={styles.container}>
                <div className={styles.card}>
                    <h1 className={styles.title}>Sistema de Reservas</h1>
                    <p className={styles.subtitle}>
                        Escolha uma das opções abaixo para continuar:
                    </p>

                    <div className={styles.buttons}>
                        <button
                            className={`${styles.button} ${styles.profile}`}
                            onClick={() => navigate("/perfil")}
                        >
                            👤 Perfil
                        </button>

                        <button
                            className={`${styles.button} ${styles.cadastroUsuario}`}
                            onClick={() => navigate("/cadastro/cliente")}
                        >
                            🪪 Cadastrar Usuário
                        </button>

                        <button
                            className={`${styles.button} ${styles.cadastroMesa}`}
                            onClick={() => navigate("/cadastro/mesa")}
                        >
                            🍽️ Cadastrar Mesa
                        </button>

                        <button
                            className={`${styles.button} ${styles.listarMesas}`}
                            onClick={() => navigate("/mesas")}
                        >
                            📋 Consultar Mesas
                        </button>

                        <button
                            className={`${styles.button} ${styles.logout}`}
                            onClick={() => {
                                localStorage.removeItem("token");
                                navigate("/", { replace: true });
                                window.location.reload();
                            }}
                        >
                            🚪 Logout
                        </button>

                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
