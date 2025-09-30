const request = require("supertest")
const app = require("../app")

test("POST /auth/cadastro deve retornar Usuário cadastrado com sucesso", async () => {
  const res = await request(app)
    .post("/auth/cadastro")
    .send({
      nome: "Teste",
      email: "teste@example.com",
      senha: "123456",
      tipo: "cliente"
    })

  expect(res.status).toBe(200)
  expect(res.body.erro).toBeFalsy()
  expect(res.body.mensagem).toBe("Usuário cadastrado com sucesso!")
})

test("POST /auth/cadastro deve retornar Tipo de usuário inválido", async () => {
  const res = await request(app)
    .post("/auth/cadastro")
    .send({
      nome: "Teste2",
      email: "teste2@example.com",
      senha: "123456",
      tipo: "invalido"
    })

  expect(res.body.erro).toBeTruthy()
  expect(res.body.mensagem).toBe("Tipo de usuário inválido! Somente 'cliente' ou 'admin'.")
})

test("POST /auth/cadastro deve retornar Todos os campos são obrigatórios para tipo vazio", async () => {
  const res = await request(app)
    .post("/auth/cadastro")
    .send({
      nome: "Teste3",
      email: "teste3@example.com",
      senha: "123456",
      tipo: ""
    })

  expect(res.body.erro).toBeTruthy()
  expect(res.body.mensagem).toBe("Todos os campos são obrigatórios!")
})

test("POST /auth/cadastro deve retornar Usuário cadastrado com sucesso para tipo admin", async () => {
  const res = await request(app)
    .post("/auth/cadastro")
    .send({
      nome: "Admin",
      email: "admin@example.com",
      senha: "123456",
      tipo: "admin"
    })

  expect(res.status).toBe(200)
  expect(res.body.erro).toBeFalsy()
  expect(res.body.mensagem).toBe("Usuário cadastrado com sucesso!")
})

test("POST /auth/cadastro deve retornar erro ao tentar cadastrar com nome vazio", async () => {
  const res = await request(app)
    .post("/auth/cadastro")
    .send({
      nome: "",
      email: "semnome@example.com",
      senha: "123456",
      tipo: "cliente"
    })

  expect(res.body.erro).toBeTruthy()
  expect(res.body.mensagem).toBe("Todos os campos são obrigatórios!")
})

test("POST /auth/cadastro deve retornar erro ao tentar cadastrar com email vazio", async () => {
  const res = await request(app)
    .post("/auth/cadastro")
    .send({
      nome: "Sem Email",
      email: "",
      senha: "123456",
      tipo: "cliente"
    })

  expect(res.body.erro).toBeTruthy()
  expect(res.body.mensagem).toBe("Todos os campos são obrigatórios!")
})

test("POST /auth/cadastro deve retornar erro ao tentar cadastrar com senha vazia", async () => {
  const res = await request(app)
    .post("/auth/cadastro")
    .send({
      nome: "Sem Senha",
      email: "semsenha@example.com",
      senha: "",
      tipo: "cliente"
    })

  expect(res.body.erro).toBeTruthy()
  expect(res.body.mensagem).toBe("Todos os campos são obrigatórios!")
})

test("POST /auth/cadastro deve retornar erro ao tentar cadastrar com todos campos faltando", async () => {
  const res = await request(app)
    .post("/auth/cadastro")
    .send({})

  expect(res.body.erro).toBeTruthy()
  expect(res.body.mensagem).toBe("Todos os campos são obrigatórios!")
})

test("POST /auth/login deve retornar Autenticado com sucesso", async () => {
  await request(app).post("/auth/cadastro").send({
    nome: "Login Test",
    email: "login@example.com",
    senha: "123456",
    tipo: "cliente"
  })

  const res = await request(app).post("/auth/login").send({
    email: "login@example.com",
    senha: "123456"
  })

  expect(res.status).toBe(200)
  expect(res.body.msg).toBe("Autenticado com sucesso!")
  expect(res.body.token).toBeDefined()
})

test("POST /auth/login deve retornar Senha incorreta", async () => {
  const res = await request(app).post("/auth/login").send({
    email: "login@example.com",
    senha: "errada"
  })

  expect(res.body.msg).toBe("Senha incorreta!")
})

test("POST /auth/login deve retornar Usuário não encontrado", async () => {
  const res = await request(app).post("/auth/login").send({
    email: "naoexiste@example.com",
    senha: "123456"
  })

  expect(res.body.msg).toBe("Usuário não encontrado!")
})

test("POST /auth/login deve retornar Usuário não encontrado para email vazio", async () => {
  const res = await request(app).post("/auth/login").send({
    email: "",
    senha: "123456"
  })

  expect(res.body.msg).toBe("Usuário não encontrado!")
})

test("POST /auth/login deve retornar Senha incorreta para senha vazia", async () => {
  const res = await request(app).post("/auth/login").send({
    email: "login@example.com",
    senha: ""
  })

  expect(res.body.msg).toBe("Senha incorreta!")
})