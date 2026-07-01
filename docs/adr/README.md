# Architecture Decision Records (ADR)

Cada decisión técnica no trivial se registra aquí como un archivo numerado.
Es la **memoria del proyecto**: evita re-discutir lo ya decidido y da contexto
a quien (humano o IA) llegue después.

## Cómo crear uno
Usa el skill **`create-adr`** (copia la plantilla, numera y rellena). O manualmente:
copia `0000-template.md`, renómbralo con el siguiente número y un título en kebab-case.

## Estados de un ADR
`Propuesto` → `Aceptado` → (`Reemplazado por NNNN` | `Obsoleto`).
Un ADR no se borra ni se reescribe: si cambia la decisión, se crea uno nuevo que
reemplaza al anterior. Así queda el rastro del porqué.

## Índice
- [0000](./0000-template.md) — Plantilla (no es una decisión).
- [0001](./0001-eleccion-de-stack.md) — Elección de stack (Next.js, Supabase, shadcn/ui, Vercel).
- [0002](./0002-orm-prisma.md) — ORM: Prisma sobre Drizzle.
- [0003](./0003-pipeline-simplificado.md) — Pipeline simplificado (11 → 6 estados).
- [0004](./0004-dos-ciclos-de-vida.md) — Dos ciclos de vida (relación vs producción); refina 0003. **Parcialmente reemplazado por 0008.**
- [0005](./0005-convenciones-de-datos.md) — Convenciones de datos (uuid, timestamps, soft delete, enums, auditoría).
- [0006](./0006-stack-frontend-next16.md) — Stack frontend y adopción de Next.js 16 (Tailwind v4, shadcn/Base UI, RHF+Zod).
- [0007](./0007-autor-interacciones-propietario.md) — Autor de interacciones sin auth: usuario propietario sembrado.
- [0008](./0008-reorientacion-pipeline-entrevista.md) — Reorientación al pipeline de entrevista (pipeline único, 5 etapas nuevas); reemplaza parcialmente 0004.
