# PTA-Reservas

Sistema de reservas para restaurante desenvolvido como projeto acadêmico/pessoal. Permite que clientes criem uma conta, façam login e reservem mesas com data e horário. Administradores gerenciam o cadastro de mesas pelo sistema.

---

## Objetivo

Desenvolver uma aplicação fullstack funcional com autenticação JWT, CRUD protegido por nível de acesso e interface web responsiva, aplicando boas práticas de segurança e organização de código.

---

## Funcionalidades

- Cadastro e login de usuários com senha criptografada (bcryptjs)
- Autenticação via JWT com expiração
- Reserva de mesa por data e horário
- Listagem das próprias reservas
- Cancelamento de reserva com liberação automática da mesa
- CRUD de mesas protegido por perfil administrador
- Interface responsiva com feedback de erros e sucesso

---

## Tecnologias

**Backend**
- Node.js + Express 5
- Prisma ORM + SQLite
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
        ├── components/   # Header, Footer, Voltar, PrivateRoute
        ├── pages/        # Telas da aplicação
        ├── styles/       # CSS Modules por componente/página
        └── utils/        # Utilitários (URL da API, rota privada)
```

---

## Requisitos

- Node.js 18 ou superior
- npm 9 ou superior

---

## Instalação

```bash
# Clone o repositório
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

Edite `backend/.env` e preencha:

```env
DATABASE_URL="file:./dev.db"
SENHA_SERVIDOR=seu_segredo_jwt_aqui
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

Em desenvolvimento, se a variável não estiver definida, o frontend usa `http://localhost:3000` por padrão.

---

## Configuração do banco de dados

```bash
cd backend
npx prisma migrate dev
```

Isso cria o banco SQLite local em `backend/prisma/dev.db` e aplica todas as migrações.

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

Os testes cobrem cadastro de usuário (campos obrigatórios, validação de tipo, senha) e autenticação (login com sucesso, senha incorreta, usuário não encontrado).

---

## Comandos úteis do Prisma

```bash
# Criar uma migração após alterar o schema
npx prisma migrate dev --name nome_da_alteracao

# Visualizar o banco no navegador
npx prisma studio

# Regenerar o Prisma Client
npx prisma generate
```

---

## Autenticação

- O login retorna um token JWT com expiração de 2 horas
- O token deve ser enviado no header `Authorization: Bearer <token>`
- Rotas de criação, edição e remoção de mesas exigem perfil `admin`
- Reservas e cancelamentos exigem autenticação (qualquer usuário logado)

### Perfis de usuário

| Perfil   | Pode fazer reservas | Gerencia mesas |
|----------|---------------------|----------------|
| cliente  | Sim                 | Não            |
| admin    | Sim                 | Sim            |

---

## Rotas da API

### Autenticação (`/auth`)
| Método | Rota             | Descrição              | Auth |
|--------|------------------|------------------------|------|
| POST   | /auth/cadastro   | Cadastrar usuário      | Não  |
| POST   | /auth/login      | Login                  | Não  |
| GET    | /auth/me         | Dados do usuário logado| JWT  |

### Mesas (`/mesas`)
| Método | Rota         | Descrição         | Auth       |
|--------|--------------|-------------------|------------|
| GET    | /mesas       | Listar mesas      | Não        |
| GET    | /mesas/:id   | Buscar mesa       | Não        |
| POST   | /mesas/novo  | Criar mesa        | JWT + Admin|
| PUT    | /mesas/:id   | Atualizar mesa    | JWT + Admin|
| DELETE | /mesas/:id   | Remover mesa      | JWT + Admin|

### Reservas (`/reservas`)
| Método | Rota            | Descrição              | Auth |
|--------|-----------------|------------------------|------|
| POST   | /reservas/novo  | Criar reserva          | JWT  |
| GET    | /reservas       | Minhas reservas        | JWT  |
| DELETE | /reservas       | Cancelar reserva       | JWT  |
| GET    | /reservas/list  | Buscar reservas por data| JWT |

---

## Banco de dados (SQLite)

O projeto utiliza SQLite para desenvolvimento local. O arquivo `prisma/dev.db` não é versionado no Git.

Para deploy em produção, recomenda-se migrar para PostgreSQL:
1. Alterar o `provider` no `schema.prisma` para `postgresql`
2. Configurar `DATABASE_URL` com a connection string do PostgreSQL
3. Rodar `npx prisma migrate deploy`

---

## Preparação para deploy

Antes de publicar:

1. Defina `SENHA_SERVIDOR` com um valor seguro e aleatório (ex: `openssl rand -hex 32`)
2. Configure `DATABASE_URL` apontando para o banco de produção
3. Configure `VITE_API_URL` com a URL real do backend antes do build do frontend
4. Execute o build do frontend: `cd frontend && npm run build`
5. Sirva a pasta `frontend/dist` com um servidor estático ou CDN

---

## Melhorias futuras

- Migração do banco para PostgreSQL em produção
- Paginação na listagem de reservas
- Painel administrativo para visualizar todas as reservas
- Envio de confirmação por e-mail
- Cancelamento de reserva pela interface do usuário
- Testes de integração para reservas e mesas

---

## Autor

Desenvolvido por **Guilherme Henrique** e **Enzo Mazer** como projeto de portfólio acadêmico.
