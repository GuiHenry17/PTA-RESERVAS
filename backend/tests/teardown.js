const path = require("path");
const fs = require("fs");

module.exports = async () => {
  const dbPath = path.resolve(__dirname, "../prisma/test.db");

  [dbPath, dbPath + "-wal", dbPath + "-shm"].forEach((p) => {
    if (fs.existsSync(p)) fs.unlinkSync(p);
  });

  console.log("\n✓ Banco de teste removido.");
};
