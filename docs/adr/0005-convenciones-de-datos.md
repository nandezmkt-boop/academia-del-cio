# 0005 — Convenciones de datos

- **Estado:** Aceptado
- **Fecha:** 2026-06-17
- **Decisores:** Usuario (product owner) + Claude (arquitecto)
- **Relación:** deriva del modelo de `docs/domain.md` y de la sesión de arquitectura de datos.

## Contexto
Antes de escribir `schema.prisma` fijamos las convenciones transversales para que
el modelo relacional sea coherente, profesional y evolucionable, manteniendo las
simplificaciones deliberadas de V1.

## Decisiones

### Claves primarias
- **`uuid`** en todas las entidades. No expone conteos ni permite enumerar por URL;
  `Usuario.id` casará con `auth.users.id` de Supabase.

### Timestamps
- `timestamptz` en **UTC**; `createdAt` (default now) y `updatedAt` (auto) en todas.
- Se distingue **`fecha` de negocio** (cuándo ocurrió, lo pone el usuario, puede
  retro-datarse) de **`createdAt`** (cuándo se registró, lo pone el sistema).

### Borrado y archivado
- **Soft delete** vía `deletedAt` (nullable) en todas; **nunca** borrado físico.
- **`archivedAt`** (en Persona) es distinto de `deletedAt`: archivar es decisión de
  negocio (consultable), borrar es quitar de en medio (oculto).
- FKs con **`onDelete: Restrict`** (relaciones obligatorias) o **`SetNull`**
  (opcionales) para no arrastrar/destruir historia en cascada.
- **RGPD:** son datos personales reales; el "derecho al olvido" se atenderá con un
  proceso *deliberado* de purga/anonimización (runbook futuro), no con borrado normal.

### Enums
- Nativos de Postgres para conjuntos estables: `EstadoRelacion`, `EstadoEntrevista`,
  `DireccionInteraccion`.
- `CanalInteraccion` también como enum, **asumiendo** que añadir valores (p.ej.
  WhatsApp) requiere migración; si el churn fuera alto se reconsideraría `text`.

### Estado de relación (corrección de modelado)
- `EstadoRelacion` contiene **solo progreso**: IDENTIFICADO, INVESTIGADO, CONTACTADO,
  EN_CONVERSACION, ENTREVISTADO.
- "Archivado" NO es un valor del enum → se representa con `archivedAt` (ortogonal al
  embudo: se puede archivar a alguien en cualquier punto sin perder su estado).
- "Inactivo" NO se almacena → se **deriva** (p.ej. `fechaSeguimiento` vencida o N días
  sin interacción). Un campo menos que mantener.

### Auditoría
- **V1 = nivel 1:** `createdAt/updatedAt` + autoría de dominio (`autorId` en Interacción,
  `responsableId` en Persona/Entrevista) + el timeline append-only de Interacción.
- Nivel 2 (`createdById/updatedById` por fila) y nivel 3 (log de cambios a nivel de
  campo) quedan fuera de V1 por innecesarios.

## Simplificaciones deliberadas de V1 (reafirmadas)
- `temas` como **array de texto** (no entidad).
- Organización como **campos** `empresaActual`/`cargoActual` (no entidad).
- **Sin** entidad de oportunidades comerciales.
- **Sin** roles/permisos avanzados sobre Usuario.
Todas con costura para evolucionar sin rediseño (ver `domain.md`).

## Consecuencias
- Positivas: modelo coherente, seguro frente a pérdidas de datos, listo para IA y evolución.
- Costes: el soft delete obliga a filtrar `deletedAt IS NULL` → se resolverá con una
  **Prisma Client Extension** para no depender de recordarlo en cada consulta.
