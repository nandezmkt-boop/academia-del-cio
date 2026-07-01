-- Reorientación del pipeline: nuevos estados + remapeo de datos + fechas por etapa.
-- El bloque AlterEnum sustituye el cast directo de Prisma por un CASE que traduce
-- los estados que desaparecen (Prisma no genera el remapeo de datos):
--   Identificado / Investigado / Contactado -> CONTACTADO
--   En conversación                          -> INTERESADO
--   Entrevistado                             -> ENTREVISTADO

-- AlterEnum
BEGIN;
CREATE TYPE "EstadoRelacion_new" AS ENUM ('CONTACTADO', 'INTERESADO', 'CONFIRMADO', 'ENTREVISTADO', 'IMPACTO');
ALTER TABLE "Persona" ALTER COLUMN "estadoRelacion" DROP DEFAULT;
ALTER TABLE "Persona" ALTER COLUMN "estadoRelacion" TYPE "EstadoRelacion_new" USING (
  CASE "estadoRelacion"::text
    WHEN 'IDENTIFICADO' THEN 'CONTACTADO'
    WHEN 'INVESTIGADO' THEN 'CONTACTADO'
    WHEN 'CONTACTADO' THEN 'CONTACTADO'
    WHEN 'EN_CONVERSACION' THEN 'INTERESADO'
    WHEN 'ENTREVISTADO' THEN 'ENTREVISTADO'
  END::"EstadoRelacion_new"
);
ALTER TYPE "EstadoRelacion" RENAME TO "EstadoRelacion_old";
ALTER TYPE "EstadoRelacion_new" RENAME TO "EstadoRelacion";
DROP TYPE "EstadoRelacion_old";
ALTER TABLE "Persona" ALTER COLUMN "estadoRelacion" SET DEFAULT 'CONTACTADO';
COMMIT;

-- AlterTable
ALTER TABLE "Persona" ADD COLUMN     "fechaEntrevista" DATE,
ADD COLUMN     "fechaLlamada" DATE,
ADD COLUMN     "fechaPublicacionPrevista" DATE,
ALTER COLUMN "estadoRelacion" SET DEFAULT 'CONTACTADO';
