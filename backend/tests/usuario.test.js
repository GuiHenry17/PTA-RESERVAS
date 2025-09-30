const request = require("supertest");
const app = require("../app");

test("POST /auth/cadastro deve retornar Cadastrado com sucesso!", async () => {
  const res = await request(app)
    .post("/auth/cadastro")
    .send({
      nome: "Teste",
      email: "teste@example.com",
      senha: "123456",
      tipo: "cliente"
    });

  expect(res.status).toBe(200);
  expect(res.body.erro).toBe(false);
  expect(res.body.mensagem).toBe("Usuário cadastrado com sucesso!");
});

test("POST /auth/cadastro deve retornar Tipo de usuário inválido", async () => { 
  const res = await request(app)
    .post("/auth/cadastro")
    .send({
      nome: "Teste2",
      email: "teste2@example.com",
      senha: "123456",
      tipo: "invalido"
    });

  expect(res.body.erro).toBe(true);
  expect(res.body.mensagem).toBe("Tipo de usuário inválido");
});

test("POST /auth/login deve retornar Autenticado com sucesso!", async () => {
  await request(app).post("/auth/cadastro").send({
    nome: "Login Test",
    email: "login@example.com",
    senha: "123456",
    tipo: "cliente"
  });

  const res = await request(app).post("/auth/login").send({
    email: "login@example.com",
    senha: "123456"
  });

  expect(res.status).toBe(200);
  expect(res.body.msg).toBe("Autenticado com sucesso!");
  expect(res.body.token).toBeDefined();
});

test("POST /auth/login deve retornar Senha incorreta", async () => {
  const res = await request(app).post("/auth/login").send({
    email: "login@example.com",
    senha: "errada"
  });

  expect(res.body.msg).toBe("Senha incorreta!");
});

test("POST /auth/login deve retornar Usuário não encontrado", async () => {
  const res = await request(app).post("/auth/login").send({
    email: "naoexiste@example.com",
    senha: "123456"
  });

  expect(res.body.msg).toBe("Usuário não encontrado!");
});
