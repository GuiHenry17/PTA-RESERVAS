const app = require("./app");
const port = process.env.PORT || 3000;

// Impede a aplicação de rodar sem o segredo JWT configurado
if (!process.env.SENHA_SERVIDOR) {
  console.error(
    "[ERRO] A variável de ambiente SENHA_SERVIDOR não está definida.\n" +
    "Copie .env.example para .env e preencha os valores necessários."
  );
  process.exit(1);
}

app.listen(port, () => {
  console.log(`Aplicação rodando em http://localhost:${port}`);
});
