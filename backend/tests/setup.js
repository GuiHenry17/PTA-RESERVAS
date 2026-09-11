const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

module.exports = async () => {
  const dbPath = path.resolve(__dirname, "../prisma/test.db");

  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
  }

  process.env.DATABASE_URL = "file:./prisma/test.db";
  process.env.SENHA_SERVIDOR = "test_secret_key_pta_reservas_2026";
  process.env.DATABASE_URL_TEST = process.env.DATABASE_URL;

  const schemaTeste = path.resolve(__dirname, "../prisma/schema.test.prisma");
  const nodeModulesPrisma = path.resolve(__dirname, "../node_modules/prisma/build/index.js");

  execSync(
    `node "${nodeModulesPrisma}" db push --schema="${schemaTeste}" --accept-data-loss --skip-generate`,
    {
      cwd: path.resolve(__dirname, ".."),
      env: { ...process.env, DATABASE_URL: "file:./prisma/test.db" },
      stdio: "pipe",
    }
  );

  console.log("\n✓ Banco de teste SQLite criado em prisma/test.db");
};
