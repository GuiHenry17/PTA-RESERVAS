/**
 * Jest Global Teardown
 * Remove o banco SQLite de testes após todas as suítes executarem.
 */
const path = require("path");
const fs = require("fs");

module.exports = async () => {
  const dbPath = path.resolve(__dirname, "../prisma/test.db");
  const walPath = dbPath + "-wal";
  const shmPath = dbPath + "-shm";

  [dbPath, walPath, shmPath].forEach((p) => {
    if (fs.existsSync(p)) fs.unlinkSync(p);
  });

  console.log("\n✓ Banco de teste removido.");
};
