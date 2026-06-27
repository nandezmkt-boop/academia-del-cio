# 0007 — Autor de interacciones sin auth: usuario propietario sembrado

- **Estado:** Aceptado
- **Fecha:** 2026-06-27
- **Decisores:** Usuario (product owner) + Claude (arquitecto)
- **Relación:** habilita la Fase 4 (timeline); la autenticación sigue diferida (ver Fase 2).

## Contexto
`Interaccion.autorId` es obligatorio (FK → `Usuario`, `onDelete: Restrict`), pero la
autenticación está diferida y no existía ninguna fila `Usuario`. Sin un autor no se
pueden crear interacciones. El usuario quiere conservar la autoría (no eliminarla).

## Decisión
Sembrar un **único `Usuario` "propietario"** (`prisma/seed.mjs`, idempotente vía
`upsert` por email) y atribuirle todas las interacciones. Las Server Actions obtienen
el autor con `db.usuario.findFirst()` (sin uuid hardcodeado).

## Alternativas consideradas
- **`autorId` opcional** (migración): más simple pero pierde la autoría temporalmente.
- **Auth mínima ya**: resuelve de raíz pero amplía el alcance (auth estaba diferida).

## Consecuencias
- Positivas: autoría preservada; sin cambio de schema; desbloquea la Fase 4.
- Reconciliación futura: al añadir Supabase Auth, el `Usuario` propietario se alinea con
  el `uid` real; las FKs son `ON UPDATE CASCADE`, así que actualizar el id propaga.
- El seed debe ejecutarse una vez (`npx prisma db seed`); la BD de Supabase es
  compartida dev/prod, así que cubre ambos entornos.
