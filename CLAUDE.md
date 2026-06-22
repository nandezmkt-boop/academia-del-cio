# CLAUDE.md — Academia del CIO

Manual operativo MÍNIMO. Se carga en cada sesión, así que solo contiene lo
esencial. El conocimiento detallado vive en `docs/` y se lee bajo demanda.

## Qué es
Plataforma interna para gestionar entrevistas a líderes tecnológicos, desde la
identificación del candidato hasta la relación a largo plazo. La relación importa
más que el contenido.

## Stack
- **Framework:** Next.js **16** (App Router, Turbopack) + TypeScript · React 19
- **BD:** Supabase (Postgres gestionado) — migrado y operativo
- **ORM:** Prisma **6.x** (NO subir a 7; ver `adr/0002`)
- **UI:** shadcn/ui (variante **Base UI**) + Tailwind **v4** · **Formularios:** react-hook-form + Zod
- **Deploy:** Vercel · Runtime local: Node v24, npm 11

## Comandos
- `npm run dev` — servidor de desarrollo (http://localhost:3000)
- `npm run build` · `npm run lint`
- `npm run db:migrate` — crea/aplica migración en DEV (usa el skill `db-change`)
- `npm run db:studio` — Prisma Studio · `npm run db:validate` · `npm run db:format` · `npm run db:generate`

## Convenciones
- **Decisiones** no triviales → se registran como ADR (usa el skill `create-adr`).
- **Cambios de base de datos** → SIEMPRE con el skill `db-change` (nunca SQL a mano).
- **Funcionalidades nuevas** → empezar con el skill `start-feature`.
- El esquema de BD vive en migraciones de Prisma; el historial de migraciones NO se edita a mano.
- TypeScript en modo estricto.
- **Estructura:** routing en `src/app`; lógica de cada entidad en `src/features/<entidad>`
  (`schema.ts`/`queries.ts`/`actions.ts`/`components/`); UI compartida en `src/components/ui`.
- **Server por defecto**, cliente (`"use client"`) solo en hojas interactivas. Lecturas
  en `queries.ts` (`import 'server-only'`); mutaciones en Server Actions que revalidan con Zod.

## Do / Don't críticos
- ❌ NUNCA ejecutar comandos destructivos contra producción (drop, reset, migrate deploy).
- ❌ NUNCA editar `.env` ni secretos sin confirmación explícita del usuario.
- ✅ Mantener este archivo MÍNIMO: si algo es explicación o contexto, va a `docs/`.

## Mapa del conocimiento (leer bajo demanda)
- Visión / negocio → `docs/vision.md`
- Modelo de dominio y glosario → `docs/domain.md`
- Pipeline y estados → `docs/pipeline.md`
- Roadmap y fases → `docs/roadmap.md`
- Decisiones de arquitectura → `docs/adr/`
- Cómo configurar MCPs → `docs/runbooks/mcp-setup.md`

## Sistema de trabajo
- **Skills** (`.claude/skills/`): `start-feature`, `db-change`, `create-adr`.
- **Hooks** (`.claude/hooks/`): formato automático, protección de archivos sensibles,
  guardarraíl ante comandos destructivos y puerta de cierre (typecheck/tests/build).
