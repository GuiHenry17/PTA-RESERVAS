import styles from "../styles/Cardapio.module.css";
import VoltarHome from "../components/Voltar";

export default function Cardapio() {
  const itens = [
    {
      nome: "Risoto Cremoso de Camarão",
      preco: "R$ 49,90",
      img: "https://www.galbani.com.br/wp-content/uploads/2024/10/risoto-de-camarao-1.jpg"
    },
    {
      nome: "Filé ao Molho Madeira",
      preco: "R$ 54,90",
      img: "https://cloudfront-us-east-1.images.arcpublishing.com/newr7/KB7KQUE54JG6TEAQO2YGSWIAZU.jpeg"
    },
    {
      nome: "Penne ao Pesto",
      preco: "R$ 39,90",
      img: "https://s2.glbimg.com/CK0xZqmrDSqkclItM9HZYqGxxqA=/top/smart/e.glbimg.com/og/ed/f/original/2019/04/09/penne_ao_pesto_genoves.jpg"
    }
  ];

  return (
    <div className={styles.tela}>
      <VoltarHome />

      <div className={styles.container}>
        <h1 className={styles.titulo}>Cardápio</h1>

        <div className={styles.grid}>
          {itens.map((item, index) => (
            <div className={styles.card} key={index}>
              <img src={item.img} alt={item.nome} className={styles.img} />

              <h2 className={styles.nome}>{item.nome}</h2>
              <p className={styles.preco}>{item.preco}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
