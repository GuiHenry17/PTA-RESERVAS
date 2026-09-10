const request = require("supertest");
const app = require("../app");

const dadosBase = {
  nome: "Teste",
  sobrenome: "Silva",
  estado: "SP",
  cidade: "São Paulo",
  bairro: "Centro",
  rua: "Rua Principal",
  numero: 100,
  email: "teste@example.com",
  password: "123456",
};

test("POST /auth/cadastro deve retornar Usuário cadastrado com sucesso", async () => {
  const res = await request(app)
    .post("/auth/cadastro")
    .send({ ...dadosBase, email: "cadastro1@example.com" });

  expect(res.status).toBe(200);
  expect(res.body.erro).toBeFalsy();
  expect(res.body.mensagem).toBe("Usuário cadastrado com sucesso!");
});

test("POST /auth/cadastro deve retornar Tipo de usuário inválido", async () => {
  const res = await request(app)
    .post("/auth/cadastro")
    .send({ ...dadosBase, email: "invalido@example.com", tipo: "invalido" });

  expect(res.body.erro).toBeTruthy();
  expect(res.body.mensagem).toBe("Tipo de usuário inválido! Somente 'cliente' ou 'admin'.");
});

test("POST /auth/cadastro deve retornar erro ao tentar cadastrar com nome vazio", async () => {
  const res = await request(app)
    .post("/auth/cadastro")
    .send({ ...dadosBase, nome: "", email: "semnome@example.com" });

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
    .send({ ...dadosBase, email: "semsenha@example.com", password: "" });

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
    .send({ ...dadosBase, email: "admin@example.com", tipo: "admin" });

  expect(res.status).toBe(200);
  expect(res.body.erro).toBeFalsy();
  expect(res.body.mensagem).toBe("Usuário cadastrado com sucesso!");
});

test("POST /auth/login deve retornar Autenticado com sucesso", async () => {
  // Garante que o usuário existe antes do login
  await request(app).post("/auth/cadastro").send({
    ...dadosBase,
    email: "login@example.com",
  });

  const res = await request(app).post("/auth/login").send({
    email: "login@example.com",
    password: "123456",
  });

  expect(res.status).toBe(200);
  expect(res.body.msg).toBe("Autenticado com sucesso!");
  expect(res.body.token).toBeDefined();
});

test("POST /auth/login deve retornar Senha incorreta", async () => {
  const res = await request(app).post("/auth/login").send({
    email: "login@example.com",
    password: "errada",
  });

  expect(res.body.msg).toBe("Senha incorreta!");
});

test("POST /auth/login deve retornar Usuário não encontrado", async () => {
  const res = await request(app).post("/auth/login").send({
    email: "naoexiste@example.com",
    password: "123456",
  });

  expect(res.body.msg).toBe("Usuário não encontrado!");
});

test("POST /auth/login deve retornar Usuário não encontrado para email vazio", async () => {
  const res = await request(app).post("/auth/login").send({
    email: "",
    password: "123456",
  });

  expect(res.body.msg).toBe("Usuário não encontrado!");
});

test("POST /auth/login deve retornar Senha incorreta para senha vazia", async () => {
  const res = await request(app).post("/auth/login").send({
    email: "login@example.com",
    password: "",
  });

  expect(res.body.msg).toBe("Senha incorreta!");
});
