# 0001 — Elección de stack

- **Estado:** Aceptado
- **Fecha:** 2026-06-16
- **Decisores:** Usuario (product owner) + Claude (arquitecto)

## Contexto
Necesitamos un stack para una app interna profesional, de uso diario, mantenible
por **una sola persona con nivel de programación bajo** apoyada en IA. Volumen
inicial bajo, equipo 1-3. Objetivos: valor de negocio, calidad, aprendizaje,
capacidad de evolución y buenas prácticas de desarrollo asistido por IA. App y BD
propias (no no-code puro), arquitectura simple.

## Decisión
- **Framework:** Next.js (App Router) + TypeScript.
- **Base de datos:** Supabase (Postgres gestionado + Auth + Storage), con MCP oficial.
- **UI:** shadcn/ui + Tailwind (componentes en el repo, propiedad del proyecto).
- **Despliegue:** Vercel (previews por cambio).

## Alternativas consideradas
- **BD:** Postgres autogestionado / Neon. Postgres propio añade ops (backups,
  upgrades, auth casera) que un mantenedor único no debería asumir. Neon es válido
  pero no trae auth. → Supabase gana por mantenimiento mínimo; sigue siendo Postgres
  (salida vía `pg_dump`).
- **Framework:** Remix, SvelteKit, Astro. Next.js tiene el mayor corpus de ejemplos
  (la IA acierta más), ecosistema y sinergia con shadcn/Vercel. Astro no encaja en app CRUD.
- **UI:** MUI/Ant/Mantine. Más pesados y opinados; shadcn da propiedad del código y
  la IA puede editar los componentes directamente.
- **Deploy:** Railway/Render/Fly. Mejores para workers always-on, que aquí no hacen
  falta (Supabase cubre cron/edge). Vercel da la mejor DX de Next.

## Consecuencias
- Positivas: mantenimiento bajo, gran soporte de IA, look profesional rápido, evolución sencilla.
- Negativas/costes: cierta curva de RSC (App Router); dependencia de proveedores gestionados.
- Riesgos: lock-in. Mitigación: BD es Postgres estándar; Next puede auto-hospedarse;
  evitar acoplarse pronto a Edge Functions de Supabase.

## Estrategia de MCPs asociada
Día 1: Supabase MCP (dev/lectura). Más adelante: GitHub, Browser/Playwright, Sentry.
No instalar: scraping de redes, web-search MCP, MCPs con write amplio a producción.
Detalle en `docs/runbooks/mcp-setup.md`.
