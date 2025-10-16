import styles from '../styles/Header.module.css'

export default function Header(){
    return(
        <header className={styles.header}>
            <p>Bem-Vindos!!</p>
            <nav>
                <a href="">Iniciar</a>
                <a href="">Cadastro</a>
                <a href="">Perfil</a>
                <a href="">Atualizar Perfil</a>
            </nav>
        </header>
    )
}