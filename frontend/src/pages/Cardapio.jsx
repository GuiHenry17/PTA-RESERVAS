import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "../styles/Cardapio.module.css";

const categorias = [
  {
    nome: "Entradas",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M12 2a10 10 0 110 20A10 10 0 0112 2z" />
        <path d="M12 8v8M8 12h8" />
      </svg>
    ),
    pratos: [
      { nome: "Bruschetta ao Tomate", desc: "Pão artesanal com tomate fresco, manjericão e azeite extra virgem", preco: "R$ 28,00" },
      { nome: "Carpaccio de Filé", desc: "Lâminas finas de filé mignon com rúcula, alcaparras e parmesão", preco: "R$ 42,00" },
      { nome: "Sopa do Dia", desc: "Caldo artesanal preparado com legumes frescos da estação", preco: "R$ 24,00" },
    ],
  },
  {
    nome: "Pratos Principais",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 12h8M12 8v8" />
      </svg>
    ),
    pratos: [
      { nome: "Filé ao Molho Madeira", desc: "Filé mignon grelhado com molho madeira, acompanha risoto de cogumelos", preco: "R$ 89,00" },
      { nome: "Salmão Grelhado", desc: "Salmão fresco com crosta de ervas, arroz integral e legumes salteados", preco: "R$ 76,00" },
      { nome: "Frango Parmesão", desc: "Frango empanado com molho de tomate artesanal e queijo derretido", preco: "R$ 58,00" },
      { nome: "Massa ao Funghi", desc: "Fettuccine fresco com cogumelos funghi secchi e creme de parmesão", preco: "R$ 62,00" },
    ],
  },
  {
    nome: "Sobremesas",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M18 8h1a4 4 0 010 8h-1" /><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
        <line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" />
      </svg>
    ),
    pratos: [
      { nome: "Tiramisù da Casa", desc: "Receita tradicional italiana com mascarpone e biscoito de champanhe", preco: "R$ 34,00" },
      { nome: "Petit Gâteau", desc: "Bolo de chocolate quente com sorvete de baunilha artesanal", preco: "R$ 36,00" },
      { nome: "Mousse de Maracujá", desc: "Mousse leve e cremoso com calda de maracujá fresco", preco: "R$ 28,00" },
    ],
  },
  {
    nome: "Bebidas",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M18 8h1a4 4 0 010 8h-1" /><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
        <line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" />
      </svg>
    ),
    pratos: [
      { nome: "Suco Natural", desc: "Frutas frescas da estação, sem açúcar adicionado", preco: "R$ 14,00" },
      { nome: "Limonada Suisça", desc: "Limão siciliano, creme de leite e água com gás", preco: "R$ 18,00" },
      { nome: "Vinho da Casa (taça)", desc: "Seleção mensal do sommelier — tinto ou branco", preco: "R$ 28,00" },
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
