# Volta & Meia — Sistema de Reservas

Sistema de reservas para restaurante desenvolvido como projeto acadêmico. Permite que clientes criem uma conta, façam login e reservem mesas com data e horário. Administradores gerenciam o cadastro de mesas e acompanham todas as reservas pelo painel administrativo.

---

## Screenshots

### Página Inicial

![Página inicial com hero, diferenciais e CTA](docs/images/home-landing.png)

### Cardápio

![Cardápio com categorias, fotos e preços](docs/images/cardapio.png)

### Minhas Reservas

![Listagem de reservas do cliente com filtros e cancelamento](docs/images/minhas-reservas.png)

### Painel Administrativo

![Dashboard admin com métricas de mesas e reservas](docs/images/painel-admin.png)

---

## Objetivo

Desenvolver uma aplicação fullstack funcional com autenticação JWT, CRUD protegido por nível de acesso e interface web responsiva, aplicando boas práticas de segurança e organização de código.

---

## Funcionalidades

- Cadastro e login de usuários com senha criptografada (bcryptjs)
- Autenticação via JWT com expiração, perfil e nome no payload
- Saudação personalizada no header com avatar de iniciais e dropdown de navegação
- Reserva de mesa por data e horário com verificação de disponibilidade
- Criação de reserva com transação atômica (sem inconsistência em caso de conflito)
- Listagem e cancelamento das próprias reservas
- CRUD de mesas protegido por perfil administrador
- Liberação de mesa pelo admin cancela automaticamente a reserva ativa vinculada
- Painel administrativo com dashboard, gerenciamento de mesas e listagem de todas as reservas
- Interface responsiva com feedback de erros e sucesso

---

## Tecnologias

**Backend**
- Node.js + Express 5
- Prisma ORM
- PostgreSQL (produção via Neon) / SQLite (testes automatizados)
- JSON Web Token (jsonwebtoken)
- bcryptjs
- CORS dinâmico via variável de ambiente

**Frontend**
- React 19 + Vite
- React Router DOM 7
- CSS Modules

---

## Arquitetura

```
PTA-RESERVAS/
├── backend/
│   ├── controllers/      # Lógica de negócio (usuário, mesa, reserva)
│   ├── middlewares/      # Autenticação JWT e verificação de admin
│   ├── prisma/           # Schema e migrações do banco
│   ├── routes/           # Definição das rotas da API
│   ├── tests/            # Testes automatizados (Jest + Supertest)
│   ├── app.js            # Configuração do Express
│   └── index.js          # Ponto de entrada do servidor
└── frontend/
    └── src/
        ├── components/   # Header, Footer, AdminNav
        ├── pages/        # Telas da aplicação (incluindo painel admin)
        ├── styles/       # CSS Modules por componente/página
        └── utils/        # api.js, PrivateRoute, AdminRoute
```

---

## Requisitos

- Node.js 18 ou superior
- npm 9 ou superior
- Banco PostgreSQL (ex: [Neon](https://neon.tech)) ou SQLite para testes

---

## Instalação

```bash
git clone https://github.com/GuiHenry17/PTA-RESERVAS.git
cd PTA-RESERVAS
```

---

## Configuração das variáveis de ambiente

### Backend

```bash
cd backend
cp .env.example .env
```

Edite `backend/.env`:

```env
# PostgreSQL (produção ou Neon):
DATABASE_URL="postgresql://usuario:senha@host.neon.tech/banco?sslmode=require"

# Segredo JWT — use um valor longo e aleatório
SENHA_SERVIDOR=seu_segredo_aqui

# Origens permitidas pelo CORS (separadas por vírgula)
# Em desenvolvimento pode deixar em branco (localhost:5173 é permitido automaticamente)
# Em produção defina a URL do frontend:
ALLOWED_ORIGINS=https://seu-frontend.vercel.app
```

> O servidor não inicia se `SENHA_SERVIDOR` não estiver definido.

### Frontend

```bash
cd frontend
cp .env.example .env
```

Edite `frontend/.env`:

```env
API_URL=http://localhost:3000
```

Se a variável não estiver definida, o frontend usa `http://localhost:3000` por padrão.

---

## Configuração do banco de dados

```bash
cd backend
npx prisma generate
npx prisma migrate deploy
```

---

## Executando o projeto

### Backend

```bash
cd backend
npm install
npm start          # produção
npm run dev        # desenvolvimento (reinicia ao salvar)
```

O servidor inicia em `http://localhost:3000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend inicia em `http://localhost:5173`.

---

## Testes

```bash
cd backend
npm test
```

Os testes usam um banco SQLite isolado (criado e destruído automaticamente). Cobrem:

- Cadastro de usuário (campos obrigatórios, validação de e-mail, senha, tipo)
- Autenticação (login, senha incorreta, usuário não encontrado, token inválido)
- CRUD de mesas (criação, listagem, autorização, duplicidade, 404)
- Reservas (criação, listagem própria, rejeição de mesa indisponível, data no passado)
- **Liberação de mesa**: 8 testes provam que a mesa continua existindo, o usuário continua existindo, a reserva fica com `status=false` (soft-cancel, não deletada), e que uma nova reserva pode ser feita na mesa liberada
- Cancelamento de reserva (soft-cancel, FK preservada, sem acesso cruzado entre usuários)
- Casos de borda: sem autenticação, sem permissão admin, entidade inexistente, estado duplicado

---

## Decisões técnicas

### Transações atômicas na criação e cancelamento de reserva

A criação e o cancelamento de reserva envolvem duas tabelas (`Reserva` e `Mesa`). Ambas as operações são executadas dentro de `client.$transaction()` para garantir que, se qualquer etapa falhar, nenhuma alteração parcial seja persistida — evitando estados inconsistentes como uma mesa marcada como reservada sem reserva correspondente no banco.

### Soft-delete nas reservas

Ao cancelar uma reserva — pelo cliente ou pelo admin ao liberar uma mesa — o registro não é deletado. O campo `status` é alterado para `false`. Isso preserva o histórico completo, mantém a integridade referencial e permite auditoria futura.

### Autorização baseada no payload do JWT

O middleware `verificaAdmin` não faz query ao banco. Os campos `tipo` e `nome` são incluídos no payload do JWT no momento do login e lidos diretamente do token já verificado. Isso elimina uma query por requisição sem abrir mão de segurança — o token é assinado com o segredo do servidor.

### Dois schemas Prisma (produção/teste)

Os testes usam SQLite em vez de PostgreSQL para rodar sem dependência externa. Existe um `schema.test.prisma` separado que aponta para o client SQLite gerado em `.prisma/client-test`. O `prismaClient.js` escolhe qual client usar com base na variável `NODE_ENV`.

### Verificação de expiração do JWT no cliente

`PrivateRoute` e `AdminRoute` decodificam o payload do token localmente e verificam o campo `exp`. Se expirado, o usuário é redirecionado para login e o token é removido do localStorage — sem requisição ao servidor.

### CORS dinâmico via variável de ambiente

O backend aceita origins configuradas via `ALLOWED_ORIGINS` (separadas por vírgula). Em desenvolvimento, permite `localhost:5173` automaticamente. Em produção, basta definir a variável com a URL do frontend.

---

## Comandos úteis do Prisma

```bash
# Aplicar migrações (produção)
npx prisma migrate deploy

# Visualizar o banco no navegador
npx prisma studio

# Regenerar o Prisma Client após mudanças no schema
npx prisma generate
```

---

## Autenticação

- O login retorna um token JWT com expiração de 2 horas
- O payload inclui `id`, `tipo` e `nome` do usuário
- O token deve ser enviado no header `Authorization: Bearer <token>`
- Rotas de criação, edição e remoção de mesas exigem perfil `admin`
- Reservas e cancelamentos exigem autenticação (qualquer usuário logado)
- O painel administrativo (`/admin`) é acessível apenas para usuários `admin`

### Perfis de usuário

| Perfil  | Pode fazer reservas | Gerencia mesas | Acessa painel admin |
|---------|---------------------|----------------|---------------------|
| cliente | Sim                 | Não            | Não                 |
| admin   | Sim                 | Sim            | Sim                 |

---

## Rotas da API

### Autenticação (`/auth`)

| Método | Rota           | Descrição               | Auth |
|--------|----------------|-------------------------|------|
| POST   | /auth/cadastro | Cadastrar usuário       | Não  |
| POST   | /auth/login    | Login                   | Não  |
| GET    | /auth/me       | Dados do usuário logado | JWT  |

### Mesas (`/mesas`)

| Método | Rota        | Descrição                                      | Auth        |
|--------|-------------|------------------------------------------------|-------------|
| GET    | /mesas      | Listar mesas                                   | Não         |
| GET    | /mesas/:id  | Buscar mesa                                    | Não         |
| POST   | /mesas/novo | Criar mesa                                     | JWT + Admin |
| PUT    | /mesas/:id  | Atualizar mesa (liberar cancela reserva ativa) | JWT + Admin |
| DELETE | /mesas/:id  | Remover mesa                                   | JWT + Admin |

### Reservas (`/reservas`)

| Método | Rota            | Descrição                | Auth        |
|--------|-----------------|--------------------------|-------------|
| POST   | /reservas/novo  | Criar reserva            | JWT         |
| GET    | /reservas       | Minhas reservas          | JWT         |
| DELETE | /reservas       | Cancelar reserva         | JWT         |
| GET    | /reservas/list  | Buscar reservas por data | JWT         |
| GET    | /reservas/todas | Todas as reservas        | JWT + Admin |

---

## Painel Administrativo

Acessível em `/admin` para usuários com perfil `admin`.

| Página            | Funcionalidade                           |
|-------------------|------------------------------------------|
| `/admin`          | Dashboard com resumo de mesas e reservas |
| `/admin/mesas`    | CRUD completo de mesas                   |
| `/admin/reservas` | Listagem de todas as reservas com filtro |

Para criar um usuário admin, use o SQL Editor do Neon:

```sql
UPDATE "Usuario" SET tipo = 'admin' WHERE email = 'seu@email.com';
```

---

## Deploy

| Serviço  | Plataforma                              | Plano    |
|----------|-----------------------------------------|----------|
| Backend  | [Render](https://render.com)            | Gratuito |
| Banco    | [Neon](https://neon.tech) (PostgreSQL)  | Gratuito |
| Frontend | [Vercel](https://vercel.com)            | Gratuito |

### Configuração no Render

- **Root Directory:** `backend`
- **Build Command:** `npm install && npx prisma generate && npx prisma migrate deploy`
- **Start Command:** `node index.js`
- **Variáveis de ambiente:** `DATABASE_URL`, `SENHA_SERVIDOR`, `ALLOWED_ORIGINS`

### Configuração na Vercel

- **Root Directory:** `frontend`
- **Variável de ambiente:** `API_URL` com a URL do Render

---

## Melhorias futuras

- Paginação na listagem de reservas
- Envio de confirmação de reserva por e-mail
- Tela de perfil do usuário com edição de dados

---

## Autor

Desenvolvido por **Guilherme Henrique** e **Enzo Mazer** como projeto de portfólio acadêmico.
