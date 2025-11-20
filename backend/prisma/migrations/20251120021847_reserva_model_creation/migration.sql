-- CreateTable
CREATE TABLE "Reserva" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuario_id" INTEGER NOT NULL,
    "mesa_id" INTEGER NOT NULL,
    "data" DATETIME NOT NULL,
    "n_pessoas" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Reserva_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Reserva_mesa_id_fkey" FOREIGN KEY ("mesa_id") REFERENCES "Mesa" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
