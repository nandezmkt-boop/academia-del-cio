# 0002 — ORM: Prisma sobre Drizzle

- **Estado:** Aceptado
- **Fecha:** 2026-06-16
- **Decisores:** Usuario (product owner) + Claude (arquitecto)

## Contexto
Decisión inicialmente reñida. El factor decisivo fue el perfil del usuario:
**nivel de programación bajo y alta dependencia de la IA.** La prioridad real es
*enviar sin romper*, no escribir/leer SQL a mano.

## Decisión
Usar **Prisma** como ORM.

## Alternativas consideradas
- **Drizzle** — SQL transparente, ligero, "enseña SQL". Era la mejor opción para un
  desarrollador que va a leer/escribir SQL. Pero esa premisa no aplica aquí.
- **Prisma** — Prisma Studio (ver/editar datos sin SQL), mayor corpus de ejemplos
  (la IA comete menos errores), schema declarativo legible, migraciones guiadas.

## Consecuencias
- Positivas: menos errores asistidos por IA, herramienta visual (Studio) ideal para
  un no-programador, migraciones acompañadas.
- Negativas/costes: capa de abstracción que oculta el SQL (aceptable: no es objetivo
  aprender SQL); engine algo más pesado.
- Riesgos: acoplamiento al ORM. Mitigación: la BD sigue siendo Postgres estándar.

## Nota
Decisión más reñida del stack; si en el futuro el perfil cambia (deseo de dominar
SQL), reconsiderar con un nuevo ADR.

## Versión: fijada a Prisma 6.x (2026-06-17)
Prisma 7 introduce un cambio de ruptura: elimina `url`/`directUrl` del `schema.prisma`
y exige `prisma.config.ts` + *driver adapter* en runtime. Eso añade piezas móviles y,
sobre todo, contradice el motivo de elegir Prisma (corpus amplio para que la IA acierte
y configuración declarativa simple). Por coherencia con esa lógica y dado el perfil del
usuario, **fijamos `prisma`/`@prisma/client` a `^6`** (instalado 6.19.x). Revisar cuando
v7 madure y tenga más corpus/herramientas estables.
