import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "../styles/Cardapio.module.css";

const categorias = [
  {
    nome: "Entradas",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2" />
        <path d="M7 2v20" />
        <path d="M21 15V2a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" />
      </svg>
    ),
    pratos: [
      {
        nome: "Bruschetta ao Tomate",
        desc: "Pão artesanal com tomate fresco, manjericão e azeite extra virgem",
        preco: "R$ 28,00",
        img: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=160&q=75&auto=format&fit=crop",
      },
      {
        nome: "Carpaccio de Filé",
        desc: "Lâminas finas de filé mignon com rúcula, alcaparras e parmesão",
        preco: "R$ 42,00",
        img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=160&q=75&auto=format&fit=crop",
      },
      {
        nome: "Sopa do Dia",
        desc: "Caldo artesanal preparado com legumes frescos da estação",
        preco: "R$ 24,00",
        img: "https://images.unsplash.com/photo-1547592180-85f173990554?w=160&q=75&auto=format&fit=crop",
      },
    ],
  },
  {
    nome: "Pratos Principais",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
        <path d="M2 12h20" />
        <path d="M12 2a15.3 15.3 0 010 20" />
      </svg>
    ),
    pratos: [
      {
        nome: "Filé ao Molho Madeira",
        desc: "Filé mignon grelhado com molho madeira, acompanha risoto de cogumelos",
        preco: "R$ 89,00",
        img: "https://images.unsplash.com/photo-1558030006-450675393462?w=160&q=75&auto=format&fit=crop",
      },
      {
        nome: "Salmão Grelhado",
        desc: "Salmão fresco com crosta de ervas, arroz integral e legumes salteados",
        preco: "R$ 76,00",
        img: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=160&q=75&auto=format&fit=crop",
      },
      {
        nome: "Frango Parmesão",
        desc: "Frango empanado com molho de tomate artesanal e queijo derretido",
        preco: "R$ 58,00",
        img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=160&q=75&auto=format&fit=crop",
      },
      {
        nome: "Massa ao Funghi",
        desc: "Fettuccine fresco com cogumelos funghi secchi e creme de parmesão",
        preco: "R$ 62,00",
        img: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=160&q=75&auto=format&fit=crop",
      },
    ],
  },
  {
    nome: "Sobremesas",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 3c-4.97 0-9 2.69-9 6s4.03 6 9 6 9-2.69 9-6-4.03-6-9-6z" />
        <path d="M3 9c0 3.31 4.03 6 9 6s9-2.69 9-6" />
        <line x1="12" y1="15" x2="12" y2="21" />
        <line x1="8" y1="21" x2="16" y2="21" />
      </svg>
    ),
    pratos: [
      {
        nome: "Tiramisù da Casa",
        desc: "Receita tradicional italiana com mascarpone e biscoito de champanhe",
        preco: "R$ 34,00",
        img: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=160&q=75&auto=format&fit=crop",
      },
      {
        nome: "Petit Gâteau",
        desc: "Bolo de chocolate quente com sorvete de baunilha artesanal",
        preco: "R$ 36,00",
        img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=160&q=75&auto=format&fit=crop",
      },
      {
        nome: "Mousse de Maracujá",
        desc: "Mousse leve e cremoso com calda de maracujá fresco",
        preco: "R$ 28,00",
        img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=160&q=75&auto=format&fit=crop",
      },
    ],
  },
  {
    nome: "Bebidas",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M18 8h1a4 4 0 010 8h-1" />
        <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
        <line x1="6" y1="1" x2="6" y2="4" />
        <line x1="10" y1="1" x2="10" y2="4" />
        <line x1="14" y1="1" x2="14" y2="4" />
      </svg>
    ),
    pratos: [
      {
        nome: "Suco Natural",
        desc: "Frutas frescas da estação, sem açúcar adicionado",
        preco: "R$ 14,00",
        img: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=160&q=75&auto=format&fit=crop",
      },
      {
        nome: "Limonada Suíça",
        desc: "Limão siciliano, creme de leite e água com gás",
        preco: "R$ 18,00",
        img: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=160&q=75&auto=format&fit=crop",
      },
      {
        nome: "Vinho da Casa (taça)",
        desc: "Seleção mensal do sommelier — tinto ou branco",
        preco: "R$ 28,00",
        img: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=160&q=75&auto=format&fit=crop",
      },
    ],
  },
];

export default function Cardapio() {
  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Cardápio</h1>
            <p className={styles.heroDesc}>
              Ingredientes selecionados, preparo artesanal e sabor que fica na memória.
            </p>
          </div>
        </div>

        <div className={styles.container}>
          {categorias.map((cat) => (
            <section key={cat.nome} className={styles.categoria}>
              <div className={styles.categoriaHeader}>
                <div className={styles.categoriaIcone}>{cat.icon}</div>
                <h2 className={styles.categoriaNome}>{cat.nome}</h2>
              </div>
              <div className={styles.pratos}>
                {cat.pratos.map((p) => (
                  <article key={p.nome} className={styles.prato}>
                    <img
                      src={p.img}
                      alt={p.nome}
                      className={styles.pratoImg}
                      loading="lazy"
                    />
                    <div className={styles.pratoInfo}>
                      <h3 className={styles.pratoNome}>{p.nome}</h3>
                      <p className={styles.pratoDesc}>{p.desc}</p>
                    </div>
                    <span className={styles.pratoPreco}>{p.preco}</span>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
