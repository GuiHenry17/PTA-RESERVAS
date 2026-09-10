# PTA-Reservas

Sistema de reservas para restaurante desenvolvido como projeto acadêmico/pessoal. Permite que clientes criem uma conta, façam login e reservem mesas com data e horário. Administradores gerenciam o cadastro de mesas e acompanham todas as reservas pelo painel administrativo.

---

## Objetivo

Desenvolver uma aplicação fullstack funcional com autenticação JWT, CRUD protegido por nível de acesso e interface web responsiva, aplicando boas práticas de segurança e organização de código.

---

## Funcionalidades

- Cadastro e login de usuários com senha criptografada (bcryptjs)
- Autenticação via JWT com expiração e campo de perfil no payload
- Reserva de mesa por data e horário com verificação de disponibilidade
- Criação de reserva com transação atômica (sem inconsistência em caso de conflito)
- Listagem das próprias reservas
- Cancelamento de reserva com liberação automática da mesa
- CRUD de mesas protegido por perfil administrador
- Liberação de mesa pelo admin cancela automaticamente a reserva ativa vinculada
- Painel administrativo com dashboard, gerenciamento de mesas e listagem de todas as reservas
- Interface responsiva com feedback de erros e sucesso

---

## Tecnologias

**Backend**
- Node.js + Express 5
- Prisma ORM
- PostgreSQL (produção via Neon) / SQLite (desenvolvimento local)
- JSON Web Token (jsonwebtoken)
- bcryptjs
- CORS

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
        ├── components/   # Header, Footer, Voltar
        ├── pages/        # Telas da aplicação (incluindo painel admin)
        ├── styles/       # CSS Modules por componente/página
        └── utils/        # api.js, PrivateRoute, AdminRoute
```

---

## Requisitos

- Node.js 18 ou superior
- npm 9 ou superior
- Banco PostgreSQL (ex: [Neon](https://neon.tech)) ou SQLite para desenvolvimento local

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
```

> O servidor não inicia se `SENHA_SERVIDOR` não estiver definido.

### Frontend

```bash
cd frontend
cp .env.example .env
```

Edite `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
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
npm start
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

12 testes cobrindo cadastro de usuário (campos obrigatórios, validação de tipo, senha) e autenticação (login com sucesso, senha incorreta, usuário não encontrado).

---

## Comandos úteis do Prisma

```bash
# Aplicar migrações existentes (produção)
npx prisma migrate deploy

# Visualizar o banco no navegador
npx prisma studio

# Regenerar o Prisma Client após mudanças no schema
npx prisma generate
```

---

## Autenticação

- O login retorna um token JWT com expiração de 2 horas
- O payload do token inclui `id` e `tipo` do usuário
- O token deve ser enviado no header `Authorization: Bearer <token>`
- Rotas de criação, edição e remoção de mesas exigem perfil `admin`
- Reservas e cancelamentos exigem autenticação (qualquer usuário logado)
- O painel administrativo (`/admin`) é acessível apenas para usuários `admin`

### Perfis de usuário

| Perfil   | Pode fazer reservas | Gerencia mesas | Acessa painel admin |
|----------|---------------------|----------------|---------------------|
| cliente  | Sim                 | Não            | Não                 |
| admin    | Sim                 | Sim            | Sim                 |

---

## Rotas da API

### Autenticação (`/auth`)
| Método | Rota           | Descrição               | Auth      |
|--------|----------------|-------------------------|-----------|
| POST   | /auth/cadastro | Cadastrar usuário       | Não       |
| POST   | /auth/login    | Login                   | Não       |
| GET    | /auth/me       | Dados do usuário logado | JWT       |

### Mesas (`/mesas`)
| Método | Rota        | Descrição                                      | Auth        |
|--------|-------------|------------------------------------------------|-------------|
| GET    | /mesas      | Listar mesas                                   | Não         |
| GET    | /mesas/:id  | Buscar mesa                                    | Não         |
| POST   | /mesas/novo | Criar mesa                                     | JWT + Admin |
| PUT    | /mesas/:id  | Atualizar mesa (liberar cancela reserva ativa) | JWT + Admin |
| DELETE | /mesas/:id  | Remover mesa                                   | JWT + Admin |

### Reservas (`/reservas`)
| Método | Rota             | Descrição                | Auth        |
|--------|------------------|--------------------------|-------------|
| POST   | /reservas/novo   | Criar reserva            | JWT         |
| GET    | /reservas        | Minhas reservas          | JWT         |
| DELETE | /reservas        | Cancelar reserva         | JWT         |
| GET    | /reservas/list   | Buscar reservas por data | JWT         |
| GET    | /reservas/todas  | Todas as reservas        | JWT + Admin |

---

## Painel Administrativo

Acessível em `/admin` para usuários com perfil `admin`.

| Página          | Funcionalidade                              |
|-----------------|---------------------------------------------|
| `/admin`        | Dashboard com resumo de mesas e reservas    |
| `/admin/mesas`  | CRUD completo de mesas                      |
| `/admin/reservas` | Listagem de todas as reservas com filtro  |

Para criar um usuário admin, use o SQL Editor do Neon:

```sql
UPDATE "Usuario" SET tipo = 'admin' WHERE email = 'seu@email.com';
```

---

## Deploy

O projeto está configurado para deploy em:

- **Backend:** [Render](https://render.com) (gratuito)
- **Banco de dados:** [Neon](https://neon.tech) (PostgreSQL gratuito e persistente)
- **Frontend:** [Vercel](https://vercel.com) (gratuito)

### Configuração no Render

- **Root Directory:** `backend`
- **Build Command:** `npm install && npx prisma generate && npx prisma migrate deploy`
- **Start Command:** `node index.js`
- **Variáveis de ambiente:** `DATABASE_URL`, `SENHA_SERVIDOR`

### Configuração na Vercel

- **Root Directory:** `frontend`
- **Variável de ambiente:** `VITE_API_URL` com a URL do Render

---

## Melhorias futuras

- Paginação na listagem de reservas
- Envio de confirmação de reserva por e-mail
- Cancelamento de reserva pela interface do cliente
- Testes de integração para reservas e mesas

---

## Autor

Desenvolvido por **Guilherme Henrique** e **Enzo Mazer** como projeto de portfólio acadêmico.
