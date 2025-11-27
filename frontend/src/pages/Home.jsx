import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <>
      <Header />

      <div className={styles.hero}>
        <div className={styles.overlay}>
          <h1 className={styles.mainTitle}>
            RESTAURANTE
            <br />
            DO JOILÇO
          </h1>
          <Link to={"/reservar"}>
          <button className={styles.reservasBtn}>Reservas</button>
          </Link>
        </div>
      </div>

      <Footer />
    </>
  );
}
