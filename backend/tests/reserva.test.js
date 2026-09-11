const request = require("supertest");
const app = require("../app");
const client = require("../prismaClient");

const base = {
  nome: "Teste",
  sobrenome: "Silva",
  password: "senha123",
};

let clienteToken = "";
let adminToken = "";
let clienteId = 0;
let adminId = 0;
let mesaId = 0;
let reservaId = 0;

const ts = Date.now();
const emailCliente = `cliente_${ts}@test.com`;
const emailAdmin = `admin_${ts}@test.com`;
const codigoMesa = `T${ts}`;

afterAll(async () => {
  try {
    if (reservaId) await client.reserva.deleteMany({ where: { id: reservaId } });
    if (mesaId) await client.mesa.deleteMany({ where: { id: mesaId } });
    if (clienteId) await client.usuario.deleteMany({ where: { id: clienteId } });
    if (adminId) await client.usuario.deleteMany({ where: { id: adminId } });
  } catch (e) {
    // ignora erros de limpeza
  }
  await client.$disconnect();
});

// ═══════════════════════════════════════════════════════════════════════════
// 1. CADASTRO DE USUÁRIO
// ═══════════════════════════════════════════════════════════════════════════

describe("POST /auth/cadastro", () => {
  test("deve cadastrar cliente com sucesso e retornar token", async () => {
    const res = await request(app)
      .post("/auth/cadastro")
      .send({ ...base, email: emailCliente });

    expect(res.status).toBe(201);
    expect(res.body.erro).toBe(false);
    expect(res.body.mensagem).toBe("Usuário cadastrado com sucesso!");
    expect(res.body.token).toBeDefined();
    clienteToken = res.body.token;
    // Extrai id do token
    const payload = JSON.parse(Buffer.from(clienteToken.split(".")[1], "base64").toString());
    clienteId = payload.id;
  });

  test("deve cadastrar admin com sucesso", async () => {
    const res = await request(app)
      .post("/auth/cadastro")
      .send({ ...base, email: emailAdmin, tipo: "admin" });

    expect(res.status).toBe(201);
    expect(res.body.erro).toBe(false);
    adminToken = res.body.token;
    const payload = JSON.parse(Buffer.from(adminToken.split(".")[1], "base64").toString());
    adminId = payload.id;
    expect(payload.tipo).toBe("admin");
  });

  test("deve rejeitar campos obrigatórios faltando", async () => {
    const res = await request(app).post("/auth/cadastro").send({});
    expect(res.status).toBe(400);
    expect(res.body.erro).toBe(true);
    expect(res.body.mensagem).toBe("Todos os campos são obrigatórios!");
  });

  test("deve rejeitar nome vazio", async () => {
    const res = await request(app)
      .post("/auth/cadastro")
      .send({ ...base, email: "semnome@test.com", nome: "" });
    expect(res.status).toBe(400);
    expect(res.body.erro).toBe(true);
  });

  test("deve rejeitar e-mail com formato inválido", async () => {
    const res = await request(app)
      .post("/auth/cadastro")
      .send({ ...base, email: "nao-e-email" });
    expect(res.status).toBe(400);
    expect(res.body.erro).toBe(true);
    expect(res.body.mensagem).toMatch(/e-mail/i);
  });

  test("deve rejeitar senha com menos de 6 caracteres", async () => {
    const res = await request(app)
      .post("/auth/cadastro")
      .send({ ...base, email: "curta@test.com", password: "123" });
    expect(res.status).toBe(400);
    expect(res.body.erro).toBe(true);
  });

  test("deve rejeitar tipo de usuário inválido", async () => {
    const res = await request(app)
      .post("/auth/cadastro")
      .send({ ...base, email: "tipo@test.com", tipo: "superadmin" });
    expect(res.status).toBe(400);
    expect(res.body.erro).toBe(true);
  });

  test("deve rejeitar e-mail duplicado", async () => {
    const res = await request(app)
      .post("/auth/cadastro")
      .send({ ...base, email: emailCliente });
    expect(res.status).toBe(409);
    expect(res.body.erro).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 2. LOGIN
// ═══════════════════════════════════════════════════════════════════════════

describe("POST /auth/login", () => {
  test("deve autenticar com sucesso", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: emailCliente, password: "senha123" });

    expect(res.status).toBe(200);
    expect(res.body.mensagem).toBe("Autenticado com sucesso!");
    expect(res.body.token).toBeDefined();
    clienteToken = res.body.token; // atualiza token
  });

  test("deve rejeitar senha incorreta", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: emailCliente, password: "errada" });
    expect(res.status).toBe(401);
    expect(res.body.mensagem).toBe("Senha incorreta!");
  });

  test("deve rejeitar usuário inexistente", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "fantasma@test.com", password: "senha123" });
    expect(res.status).toBe(401);
    expect(res.body.mensagem).toBe("Usuário não encontrado!");
  });

  test("deve rejeitar requisição sem campos", async () => {
    const res = await request(app).post("/auth/login").send({});
    expect(res.status).toBe(400);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 3. MESAS — CRUD
// ═══════════════════════════════════════════════════════════════════════════

describe("Mesas — CRUD", () => {
  test("GET /mesas deve listar mesas sem autenticação", async () => {
    const res = await request(app).get("/mesas");
    expect(res.status).toBe(200);
    expect(res.body.erro).toBe(false);
    expect(Array.isArray(res.body.mesas)).toBe(true);
  });

  test("POST /mesas/novo deve rejeitar sem token", async () => {
    const res = await request(app)
      .post("/mesas/novo")
      .send({ codigo: "X99", n_lugares: 4 });
    expect(res.status).toBe(401);
  });

  test("POST /mesas/novo deve rejeitar token de cliente (não admin)", async () => {
    const res = await request(app)
      .post("/mesas/novo")
      .set("Authorization", `Bearer ${clienteToken}`)
      .send({ codigo: "X99", n_lugares: 4 });
    expect(res.status).toBe(403);
  });

  test("POST /mesas/novo deve criar mesa com token admin", async () => {
    const res = await request(app)
      .post("/mesas/novo")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ codigo: codigoMesa, n_lugares: 4 });

    expect(res.status).toBe(201);
    expect(res.body.erro).toBe(false);
    expect(res.body.mesa).toBeDefined();
    expect(res.body.mesa.status).toBe("disponível");
    mesaId = res.body.mesa.id;
  });

  test("POST /mesas/novo deve rejeitar código duplicado", async () => {
    const res = await request(app)
      .post("/mesas/novo")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ codigo: codigoMesa, n_lugares: 2 });
    expect(res.status).toBe(409);
    expect(res.body.erro).toBe(true);
  });

  test("POST /mesas/novo deve rejeitar campos faltando", async () => {
    const res = await request(app)
      .post("/mesas/novo")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ codigo: "SEM_LUGARES" });
    expect(res.status).toBe(400);
    expect(res.body.erro).toBe(true);
  });

  test("GET /mesas/:id deve retornar mesa existente", async () => {
    const res = await request(app).get(`/mesas/${mesaId}`);
    expect(res.status).toBe(200);
    expect(res.body.mesa.id).toBe(mesaId);
    expect(res.body.mesa.status).toBe("disponível");
  });

  test("GET /mesas/:id deve retornar 404 para mesa inexistente", async () => {
    const res = await request(app).get("/mesas/9999999");
    expect(res.status).toBe(404);
    expect(res.body.erro).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 4. RESERVAS
// ═══════════════════════════════════════════════════════════════════════════

describe("Reservas", () => {
  const dataFutura = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  test("POST /reservas/novo deve rejeitar sem token", async () => {
    const res = await request(app)
      .post("/reservas/novo")
      .send({ mesaId, data: dataFutura, n_pessoas: 2 });
    expect(res.status).toBe(401);
  });

  test("POST /reservas/novo deve criar reserva com sucesso", async () => {
    const res = await request(app)
      .post("/reservas/novo")
      .set("Authorization", `Bearer ${clienteToken}`)
      .send({ mesaId, data: dataFutura, n_pessoas: 2 });

    expect(res.status).toBe(201);
    expect(res.body.erro).toBe(false);
    expect(res.body.reserva).toBeDefined();
    reservaId = res.body.reserva.id;
  });

  test("Mesa deve ter status 'reservada' após reserva", async () => {
    const res = await request(app).get(`/mesas/${mesaId}`);
    expect(res.status).toBe(200);
    expect(res.body.mesa.status).toBe("reservada");
  });

  test("POST /reservas/novo deve rejeitar mesa já reservada", async () => {
    const res = await request(app)
      .post("/reservas/novo")
      .set("Authorization", `Bearer ${clienteToken}`)
      .send({ mesaId, data: dataFutura, n_pessoas: 2 });
    expect(res.status).toBe(409);
    expect(res.body.erro).toBe(true);
  });

  test("POST /reservas/novo deve rejeitar data no passado", async () => {
    const res = await request(app)
      .post("/reservas/novo")
      .set("Authorization", `Bearer ${clienteToken}`)
      .send({ mesaId, data: "2000-01-01T00:00:00.000Z", n_pessoas: 2 });
    expect(res.status).toBe(400);
    expect(res.body.erro).toBe(true);
  });

  test("POST /reservas/novo deve rejeitar mesa inexistente", async () => {
    const res = await request(app)
      .post("/reservas/novo")
      .set("Authorization", `Bearer ${clienteToken}`)
      .send({ mesaId: 9999999, data: dataFutura, n_pessoas: 2 });
    expect(res.status).toBe(404);
    expect(res.body.erro).toBe(true);
  });

  test("GET /reservas deve listar apenas as reservas do cliente autenticado", async () => {
    const res = await request(app)
      .get("/reservas")
      .set("Authorization", `Bearer ${clienteToken}`);
    expect(res.status).toBe(200);
    expect(res.body.erro).toBe(false);
    expect(Array.isArray(res.body.reservas)).toBe(true);
    // Todas as reservas devem pertencer ao clienteId
    res.body.reservas.forEach((r) => {
      expect(r.usuario_id).toBe(clienteId);
    });
  });

  test("GET /reservas deve rejeitar sem token", async () => {
    const res = await request(app).get("/reservas");
    expect(res.status).toBe(401);
  });

  test("GET /reservas/todas deve rejeitar cliente (não admin)", async () => {
    const res = await request(app)
      .get("/reservas/todas")
      .set("Authorization", `Bearer ${clienteToken}`);
    expect(res.status).toBe(403);
  });

  test("GET /reservas/todas deve retornar todas as reservas para admin", async () => {
    const res = await request(app)
      .get("/reservas/todas")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.erro).toBe(false);
    expect(Array.isArray(res.body.reservas)).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 5. BUG CRÍTICO — LIBERAÇÃO DE MESA PELO ADMIN
// ═══════════════════════════════════════════════════════════════════════════

describe("BUG CRÍTICO — Admin libera mesa", () => {
  test("Pré-condição: mesa está 'reservada' antes da liberação", async () => {
    const res = await request(app).get(`/mesas/${mesaId}`);
    expect(res.status).toBe(200);
    expect(res.body.mesa.status).toBe("reservada");
  });

  test("Pré-condição: reserva está ativa (status=true) antes da liberação", async () => {
    const reserva = await client.reserva.findUnique({ where: { id: reservaId } });
    expect(reserva).not.toBeNull();
    expect(reserva.status).toBe(true);
  });

  test("PUT /mesas/:id — admin libera mesa com sucesso (transição reservada→disponível)", async () => {
    const res = await request(app)
      .put(`/mesas/${mesaId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ codigo: codigoMesa, n_lugares: 4, status: "disponível" });

    expect(res.status).toBe(200);
    expect(res.body.erro).toBe(false);
    expect(res.body.mesa.status).toBe("disponível");
  });

  test("PROVA DO BUG CORRIGIDO: Mesa ainda existe após liberação", async () => {
    const res = await request(app).get(`/mesas/${mesaId}`);
    expect(res.status).toBe(200);
    expect(res.body.mesa).toBeDefined();
    expect(res.body.mesa.id).toBe(mesaId);
  });

  test("PROVA DO BUG CORRIGIDO: Mesa está 'disponível' após liberação", async () => {
    const res = await request(app).get(`/mesas/${mesaId}`);
    expect(res.body.mesa.status).toBe("disponível");
  });

  test("PROVA DO BUG CORRIGIDO: Usuário ainda existe após liberação", async () => {
    const usuario = await client.usuario.findUnique({ where: { id: clienteId } });
    expect(usuario).not.toBeNull();
    expect(usuario.id).toBe(clienteId);
  });

  test("PROVA DO BUG CORRIGIDO: Reserva não foi deletada — histórico preservado", async () => {
    const reserva = await client.reserva.findUnique({ where: { id: reservaId } });
    expect(reserva).not.toBeNull(); // Reserva EXISTE no banco
  });

  test("PROVA DO BUG CORRIGIDO: Reserva está cancelada (status=false), não ativa", async () => {
    const reserva = await client.reserva.findUnique({ where: { id: reservaId } });
    expect(reserva.status).toBe(false); // Soft-cancel: status=false, não deletada
  });

  test("Novo usuário consegue reservar a mesa recém-liberada", async () => {
    // Cria segundo cliente
    const ts2 = Date.now() + 1;
    const emailCliente2 = `cliente2_${ts2}@test.com`;
    const regRes = await request(app)
      .post("/auth/cadastro")
      .send({ ...base, email: emailCliente2 });
    expect(regRes.status).toBe(201);
    const token2 = regRes.body.token;
    const payload2 = JSON.parse(Buffer.from(token2.split(".")[1], "base64").toString());

    // Reserva a mesa que foi liberada
    const dataFutura2 = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
    const reservaRes = await request(app)
      .post("/reservas/novo")
      .set("Authorization", `Bearer ${token2}`)
      .send({ mesaId, data: dataFutura2, n_pessoas: 2 });

    expect(reservaRes.status).toBe(201);
    expect(reservaRes.body.erro).toBe(false);

    // Limpeza desta reserva extra (ordem correta respeitando FK: reserva antes de usuário)
    const reservaIdExtra = reservaRes.body.reserva.id;
    const clienteId2 = payload2.id;
    await client.mesa.update({ where: { id: mesaId }, data: { status: "disponível" } });
    await client.reserva.delete({ where: { id: reservaIdExtra } });
    await client.usuario.delete({ where: { id: clienteId2 } });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 6. CANCELAMENTO DE RESERVA PELO CLIENTE
// ═══════════════════════════════════════════════════════════════════════════

describe("Cancelamento de reserva", () => {
  let reservaCancelavel;
  const dataFuturaCancelamento = new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString();

  beforeAll(async () => {
    // Mesa deve estar disponível — garante isso
    await client.mesa.update({ where: { id: mesaId }, data: { status: "disponível" } });

    // Cria nova reserva para testar cancelamento
    const res = await request(app)
      .post("/reservas/novo")
      .set("Authorization", `Bearer ${clienteToken}`)
      .send({ mesaId, data: dataFuturaCancelamento, n_pessoas: 2 });
    reservaCancelavel = res.body.reserva?.id;
  });

  test("DELETE /reservas deve rejeitar sem token", async () => {
    const res = await request(app)
      .delete("/reservas")
      .send({ reservaId: reservaCancelavel });
    expect(res.status).toBe(401);
  });

  test("DELETE /reservas deve rejeitar reserva inexistente", async () => {
    const res = await request(app)
      .delete("/reservas")
      .set("Authorization", `Bearer ${clienteToken}`)
      .send({ reservaId: 9999999 });
    expect(res.status).toBe(404);
    expect(res.body.erro).toBe(true);
  });

  test("DELETE /reservas deve cancelar reserva com sucesso (soft-cancel)", async () => {
    const res = await request(app)
      .delete("/reservas")
      .set("Authorization", `Bearer ${clienteToken}`)
      .send({ reservaId: reservaCancelavel });
    expect(res.status).toBe(200);
    expect(res.body.erro).toBe(false);
  });

  test("Reserva cancelada deve ter status=false no banco (histórico preservado)", async () => {
    const reserva = await client.reserva.findUnique({ where: { id: reservaCancelavel } });
    expect(reserva).not.toBeNull();
    expect(reserva.status).toBe(false);
  });

  test("Mesa deve estar disponível após cancelamento", async () => {
    const res = await request(app).get(`/mesas/${mesaId}`);
    expect(res.body.mesa.status).toBe("disponível");
  });

  test("DELETE /reservas deve rejeitar cancelar reserva já cancelada", async () => {
    const res = await request(app)
      .delete("/reservas")
      .set("Authorization", `Bearer ${clienteToken}`)
      .send({ reservaId: reservaCancelavel });
    expect(res.status).toBe(409);
    expect(res.body.erro).toBe(true);
  });

  test("DELETE /reservas deve rejeitar cancelar reserva de outro usuário", async () => {
    // Admin tenta cancelar reserva do cliente
    const res = await request(app)
      .delete("/reservas")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ reservaId: reservaCancelavel });
    expect(res.status).toBe(403);
    expect(res.body.erro).toBe(true);
  });

  afterAll(async () => {
    if (reservaCancelavel) {
      await client.reserva.deleteMany({ where: { id: reservaCancelavel } });
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 7. EDGE CASES — MESAS
// ═══════════════════════════════════════════════════════════════════════════

describe("Mesas — edge cases", () => {
  test("PUT /mesas/:id deve rejeitar sem token", async () => {
    const res = await request(app)
      .put(`/mesas/${mesaId}`)
      .send({ codigo: codigoMesa, n_lugares: 4, status: "disponível" });
    expect(res.status).toBe(401);
  });

  test("PUT /mesas/:id deve rejeitar cliente sem permissão admin", async () => {
    const res = await request(app)
      .put(`/mesas/${mesaId}`)
      .set("Authorization", `Bearer ${clienteToken}`)
      .send({ codigo: codigoMesa, n_lugares: 4, status: "disponível" });
    expect(res.status).toBe(403);
  });

  test("PUT /mesas/:id deve retornar 404 para mesa inexistente", async () => {
    const res = await request(app)
      .put("/mesas/9999999")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ codigo: "XXXXXXXX", n_lugares: 4, status: "disponível" });
    expect(res.status).toBe(404);
    expect(res.body.erro).toBe(true);
  });

  test("PUT /mesas/:id liberar mesa já disponível não cancela reservas (noop)", async () => {
    // Mesa está disponível, nenhuma reserva ativa
    const res = await request(app)
      .put(`/mesas/${mesaId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ codigo: codigoMesa, n_lugares: 4, status: "disponível" });
    expect(res.status).toBe(200);
    expect(res.body.erro).toBe(false);
    // Mensagem deve mencionar que não havia reserva ativa
    expect(res.body.mensagem).not.toMatch(/cancelada/i);
  });

  test("DELETE /mesas/:id deve rejeitar remoção de mesa sem token", async () => {
    const res = await request(app).delete(`/mesas/${mesaId}`);
    expect(res.status).toBe(401);
  });

  test("DELETE /mesas/:id deve permitir remoção de mesa com apenas reservas canceladas", async () => {
    // A mesa tem reservas canceladas no banco — deve poder ser removida
    const res = await request(app)
      .delete(`/mesas/${mesaId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.erro).toBe(false);
    // Limpa variável para o afterAll não tentar deletar novamente
    mesaId = 0;
  });

  test("DELETE /mesas/:id deve retornar 404 para mesa inexistente", async () => {
    const res = await request(app)
      .delete("/mesas/9999999")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(404);
    expect(res.body.erro).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 8. AUTENTICAÇÃO — TOKENS INVÁLIDOS
// ═══════════════════════════════════════════════════════════════════════════

describe("Autenticação — tokens inválidos", () => {
  test("Token inválido deve retornar 401", async () => {
    const res = await request(app)
      .get("/reservas")
      .set("Authorization", "Bearer token_invalido_aqui");
    expect(res.status).toBe(401);
  });

  test("Header Authorization ausente deve retornar 401", async () => {
    const res = await request(app).get("/reservas");
    expect(res.status).toBe(401);
  });

  test("GET /auth/me deve retornar dados do usuário autenticado", async () => {
    const res = await request(app)
      .get("/auth/me")
      .set("Authorization", `Bearer ${clienteToken}`);
    expect(res.status).toBe(200);
    expect(res.body.usuario).toBeDefined();
    expect(res.body.usuario.email).toBe(emailCliente);
    // Senha NÃO deve estar exposta
    expect(res.body.usuario.password).toBeUndefined();
  });

  test("GET /auth/me sem token deve retornar 401", async () => {
    const res = await request(app).get("/auth/me");
    expect(res.status).toBe(401);
  });
});
