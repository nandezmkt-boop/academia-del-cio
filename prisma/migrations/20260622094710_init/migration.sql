-- CreateEnum
CREATE TYPE "EstadoRelacion" AS ENUM ('IDENTIFICADO', 'INVESTIGADO', 'CONTACTADO', 'EN_CONVERSACION', 'ENTREVISTADO');

-- CreateEnum
CREATE TYPE "EstadoEntrevista" AS ENUM ('PROPUESTA', 'AGENDADA', 'GRABADA', 'PUBLICADA');

-- CreateEnum
CREATE TYPE "CanalInteraccion" AS ENUM ('EMAIL', 'LINKEDIN', 'LLAMADA', 'REUNION', 'NOTA', 'OTRO');

-- CreateEnum
CREATE TYPE "DireccionInteraccion" AS ENUM ('ENTRANTE', 'SALIENTE', 'INTERNA');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Persona" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT,
    "linkedinUrl" TEXT,
    "empresaActual" TEXT,
    "cargoActual" TEXT,
    "estadoRelacion" "EstadoRelacion" NOT NULL DEFAULT 'IDENTIFICADO',
    "responsableId" TEXT,
    "proximaAccion" TEXT,
    "fechaSeguimiento" DATE,
    "dossier" TEXT,
    "temas" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Persona_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Interaccion" (
    "id" TEXT NOT NULL,
    "personaId" TEXT NOT NULL,
    "autorId" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "canal" "CanalInteraccion" NOT NULL,
    "direccion" "DireccionInteraccion" NOT NULL,
    "resumen" TEXT NOT NULL,
    "resultado" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Interaccion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entrevista" (
    "id" TEXT NOT NULL,
    "personaId" TEXT NOT NULL,
    "estado" "EstadoEntrevista" NOT NULL DEFAULT 'PROPUESTA',
    "fecha" TIMESTAMP(3),
    "fechaConfirmada" BOOLEAN NOT NULL DEFAULT false,
    "responsableId" TEXT,
    "informeEnviado" BOOLEAN NOT NULL DEFAULT false,
    "enlaceGrabacion" TEXT,
    "notas" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Entrevista_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE INDEX "Persona_estadoRelacion_idx" ON "Persona"("estadoRelacion");

-- CreateIndex
CREATE INDEX "Persona_fechaSeguimiento_idx" ON "Persona"("fechaSeguimiento");

-- CreateIndex
CREATE INDEX "Persona_responsableId_idx" ON "Persona"("responsableId");

-- CreateIndex
CREATE INDEX "Persona_nombre_idx" ON "Persona"("nombre");

-- CreateIndex
CREATE INDEX "Interaccion_personaId_fecha_idx" ON "Interaccion"("personaId", "fecha");

-- CreateIndex
CREATE INDEX "Interaccion_autorId_idx" ON "Interaccion"("autorId");

-- CreateIndex
CREATE INDEX "Entrevista_personaId_idx" ON "Entrevista"("personaId");

-- CreateIndex
CREATE INDEX "Entrevista_estado_idx" ON "Entrevista"("estado");

-- CreateIndex
CREATE INDEX "Entrevista_fecha_idx" ON "Entrevista"("fecha");

-- CreateIndex
CREATE INDEX "Entrevista_responsableId_idx" ON "Entrevista"("responsableId");

-- AddForeignKey
ALTER TABLE "Persona" ADD CONSTRAINT "Persona_responsableId_fkey" FOREIGN KEY ("responsableId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interaccion" ADD CONSTRAINT "Interaccion_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES "Persona"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interaccion" ADD CONSTRAINT "Interaccion_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entrevista" ADD CONSTRAINT "Entrevista_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES "Persona"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entrevista" ADD CONSTRAINT "Entrevista_responsableId_fkey" FOREIGN KEY ("responsableId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
