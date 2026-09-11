const request = require("supertest");
const app = require("../app");

// Emails únicos por execução para evitar colisão entre suites que compartilham o mesmo DB SQLite
const ts = Date.now();

const dadosBase = {
  nome: "Teste",
  sobrenome: "Silva",
  password: "senha123",
};

const emailCadastro1 = `cadastro1_${ts}@example.com`;
const emailAdmin     = `admin_${ts}@example.com`;
const emailLogin     = `login_${ts}@example.com`;

test("POST /auth/cadastro deve retornar Usuário cadastrado com sucesso", async () => {
  const res = await request(app)
    .post("/auth/cadastro")
    .send({ ...dadosBase, email: emailCadastro1 });

  expect(res.status).toBe(201);
  expect(res.body.erro).toBeFalsy();
  expect(res.body.mensagem).toBe("Usuário cadastrado com sucesso!");
});

test("POST /auth/cadastro deve retornar Tipo de usuário inválido", async () => {
  const res = await request(app)
    .post("/auth/cadastro")
    .send({ ...dadosBase, email: `invalido_${ts}@example.com`, tipo: "invalido" });

  expect(res.body.erro).toBeTruthy();
  expect(res.body.mensagem).toBe("Tipo de usuário inválido! Somente 'cliente' ou 'admin'.");
});

test("POST /auth/cadastro deve retornar erro ao tentar cadastrar com nome vazio", async () => {
  const res = await request(app)
    .post("/auth/cadastro")
    .send({ ...dadosBase, nome: "", email: `semnome_${ts}@example.com` });

  expect(res.body.erro).toBeTruthy();
  expect(res.body.mensagem).toBe("Todos os campos são obrigatórios!");
});

test("POST /auth/cadastro deve retornar erro ao tentar cadastrar com email vazio", async () => {
  const res = await request(app)
    .post("/auth/cadastro")
    .send({ ...dadosBase, email: "" });

  expect(res.body.erro).toBeTruthy();
  expect(res.body.mensagem).toBe("Todos os campos são obrigatórios!");
});

test("POST /auth/cadastro deve retornar erro ao tentar cadastrar com senha vazia", async () => {
  const res = await request(app)
    .post("/auth/cadastro")
    .send({ ...dadosBase, email: `semsenha_${ts}@example.com`, password: "" });

  expect(res.body.erro).toBeTruthy();
  expect(res.body.mensagem).toBe("Todos os campos são obrigatórios!");
});

test("POST /auth/cadastro deve retornar erro ao tentar cadastrar com todos campos faltando", async () => {
  const res = await request(app)
    .post("/auth/cadastro")
    .send({});

  expect(res.body.erro).toBeTruthy();
  expect(res.body.mensagem).toBe("Todos os campos são obrigatórios!");
});

test("POST /auth/cadastro deve retornar Usuário cadastrado com sucesso para tipo admin", async () => {
  const res = await request(app)
    .post("/auth/cadastro")
    .send({ ...dadosBase, email: emailAdmin, tipo: "admin" });

  expect(res.status).toBe(201);
  expect(res.body.erro).toBeFalsy();
  expect(res.body.mensagem).toBe("Usuário cadastrado com sucesso!");
});

test("POST /auth/login deve retornar Autenticado com sucesso", async () => {
  // Cria o usuário antes de tentar logar
  await request(app).post("/auth/cadastro").send({ ...dadosBase, email: emailLogin });

  const res = await request(app).post("/auth/login").send({
    email: emailLogin,
    password: "senha123",
  });

  expect(res.status).toBe(200);
  expect(res.body.mensagem).toBe("Autenticado com sucesso!");
  expect(res.body.token).toBeDefined();
});

test("POST /auth/login deve retornar Senha incorreta", async () => {
  const res = await request(app).post("/auth/login").send({
    email: emailLogin,
    password: "errada",
  });

  expect(res.body.mensagem).toBe("Senha incorreta!");
});

test("POST /auth/login deve retornar Usuário não encontrado", async () => {
  const res = await request(app).post("/auth/login").send({
    email: "naoexiste@example.com",
    password: "senha123",
  });

  expect(res.body.mensagem).toBe("Usuário não encontrado!");
});

test("POST /auth/login deve retornar erro para email vazio (campo obrigatório)", async () => {
  const res = await request(app).post("/auth/login").send({
    email: "",
    password: "senha123",
  });

  expect(res.status).toBe(400);
  expect(res.body.mensagem).toBeDefined();
});

test("POST /auth/login deve retornar erro para senha vazia (campo obrigatório)", async () => {
  const res = await request(app).post("/auth/login").send({
    email: emailLogin,
    password: "",
  });

  expect(res.status).toBe(400);
  expect(res.body.mensagem).toBeDefined();
});
