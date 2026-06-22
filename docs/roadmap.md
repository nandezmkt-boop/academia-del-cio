# Roadmap — Academia del CIO

> De carpeta vacía a primera versión funcional. Cada fase entrega algo real y
> desbloquea la siguiente.

| Fase | Objetivo | Resultado esperado | Por qué va antes | Estado |
|---|---|---|---|---|
| **0. Cimientos** | Montar el sistema de trabajo (sin features) | docs, CLAUDE.md, ADRs, Skills, Hooks, git | No se construye sobre suelo indefinido | ✅ En curso |
| **1. Dominio y datos** | Fijar modelo de dominio + esquema de BD | `domain.md` final, schema Prisma, ADRs | El dato mal modelado contamina todo | ⬜ Siguiente |
| **2. Esqueleto andante** | Rebanada vertical mínima que persiste | Listar y crear un `Lider` real, desplegado | Valida la tubería end-to-end | 🟡 Listar+crear OK en local; falta desplegar |
| **3. Pipeline** | Mover líderes por las etapas | Tablero/lista con estados y fechas | Corazón operativo diario | ⬜ |
| **4. Memoria de relación** | Histórico de interacciones por líder | Timeline de contactos y notas | El diferenciador real frente a Excel | ⬜ |
| **5. IA donde aporta** | Investigación y contenido asistidos | Skills + MCP para dossiers/seguimiento | Solo tiene sentido sobre datos sólidos | ⬜ |

## Alcance de la v1 (in / out)
**Dentro:** gestionar líderes, su pipeline, su histórico de interacciones y sus
entrevistas; ver todo en un sitio.
**Fuera de v1:** automatización de envíos, scraping, analítica avanzada, multirol/permisos
complejos, módulo de contenido completo (al principio basta con enlaces).

## Decisiones abiertas a resolver al entrar en Fase 1
- Confirmar/crear cuentas: GitHub, Supabase, Vercel.
- Configurar el MCP de Supabase (ver `runbooks/mcp-setup.md`).
- Finalizar el modelo de dominio y los campos mínimos de cada entidad.
