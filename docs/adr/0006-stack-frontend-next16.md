# 0006 — Stack frontend y adopción de Next.js 16

- **Estado:** Aceptado
- **Fecha:** 2026-06-22
- **Decisores:** Usuario (product owner) + Claude (arquitecto)

## Contexto
El plan de Fase 2 preveía Next.js 15, pero `create-next-app@latest` instaló **Next.js
16** (con React 19.2 y Tailwind v4). Al ser un *major* distinto al planificado, se
consultó al usuario, que optó por adoptar Next 16 (versión actual, mejor soporte futuro).

## Decisión
Adoptar el siguiente stack frontend para V1:
- **Next.js 16** (App Router, Turbopack) + TypeScript + React 19.
- **Tailwind v4** (configuración CSS-first; sin `tailwind.config`).
- **shadcn/ui** en su variante actual sobre **Base UI** (no Radix). Los componentes
  se componen con la prop `render` (no `asChild`/Slot).
- **Formularios:** react-hook-form + Zod (`zodResolver`). El componente `form` no
  existe en este registro shadcn, así que se añadió el `form.tsx` canónico a mano
  (usa `@radix-ui/react-slot`, compatible con los inputs de Base UI).
- **Toasts:** `sonner` (se eliminó su dependencia de `next-themes`; tema fijo "system").

## Alternativas consideradas
- **Fijar Next 15** (como Prisma 6): más corpus/estabilidad. Pero Next 16 no rompe
  nuestra arquitectura (a diferencia de Prisma 7) y el usuario prefirió lo último.

## Consecuencias
- Positivas: soporte a futuro, React 19, Turbopack; arquitectura intacta.
- A vigilar: Base UI es más reciente que Radix (menos corpus); algunas APIs de
  componentes (Select) difieren. Mitigación: empezar por inputs simples y validar con
  `build`/`tsc`/runtime.
- Convención registrada: la capa de datos usa una extensión de soft-delete (lecturas)
  en `src/lib/db.ts` (ADR 0005); la conversión delete→update se añadirá con el borrado.
