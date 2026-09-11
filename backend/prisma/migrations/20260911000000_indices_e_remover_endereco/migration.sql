-- Remove campos de endereço do modelo Usuario (nunca utilizados na aplicação)
ALTER TABLE "Usuario" DROP COLUMN IF EXISTS "estado";
ALTER TABLE "Usuario" DROP COLUMN IF EXISTS "cidade";
ALTER TABLE "Usuario" DROP COLUMN IF EXISTS "bairro";
ALTER TABLE "Usuario" DROP COLUMN IF EXISTS "rua";
ALTER TABLE "Usuario" DROP COLUMN IF EXISTS "numero";

-- Índices para otimizar queries frequentes na tabela Reserva
CREATE INDEX IF NOT EXISTS "Reserva_usuario_id_idx" ON "Reserva"("usuario_id");
CREATE INDEX IF NOT EXISTS "Reserva_mesa_id_idx" ON "Reserva"("mesa_id");
CREATE INDEX IF NOT EXISTS "Reserva_data_idx" ON "Reserva"("data");
