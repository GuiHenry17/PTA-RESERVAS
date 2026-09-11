/**
 * prismaClient.js
 *
 * Exporta uma instância singleton do PrismaClient.
 * Em ambiente de teste (NODE_ENV=test), usa o client gerado pelo schema SQLite de teste.
 * Em produção/dev, usa o client padrão (@prisma/client).
 */

let client;

if (process.env.NODE_ENV === "test") {
  // Client gerado via schema.test.prisma (SQLite)
  const { PrismaClient } = require(".prisma/client-test");
  client = new PrismaClient({
    datasources: {
      db: { url: process.env.DATABASE_URL },
    },
  });
} else {
  const { PrismaClient } = require("@prisma/client");
  client = new PrismaClient();
}

module.exports = client;
