let client;

if (process.env.NODE_ENV === "test") {
  const { PrismaClient } = require(".prisma/client-test");
  client = new PrismaClient({
    datasources: { db: { url: process.env.DATABASE_URL } },
  });
} else {
  const { PrismaClient } = require("@prisma/client");
  client = new PrismaClient();
}

module.exports = client;
