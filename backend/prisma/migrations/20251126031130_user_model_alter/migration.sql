/*
  Warnings:

  - Added the required column `bairro` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cidade` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estado` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numero` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rua` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sobrenome` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "sobrenome" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "rua" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'cliente'
);
INSERT INTO "new_Usuario" ("email", "id", "nome", "password", "tipo") SELECT "email", "id", "nome", "password", "tipo" FROM "Usuario";
DROP TABLE "Usuario";
ALTER TABLE "new_Usuario" RENAME TO "Usuario";
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
