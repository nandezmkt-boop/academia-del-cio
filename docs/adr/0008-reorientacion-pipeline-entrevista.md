# 0008 — Reorientación al pipeline de entrevista

- **Estado:** Aceptado
- **Fecha:** 2026-07-01
- **Decisores:** Usuario (product owner) + Claude (arquitecto)
- **Relación:** reemplaza **parcialmente** a `0004-dos-ciclos-de-vida.md` (la vista de
  tablero deja de combinar dos ciclos y pasa a ser un pipeline único) y actualiza los
  valores de `EstadoRelacion` fijados en `0003` y `0005`. La **separación de
  almacenamiento** de 0004 (Persona vs Entrevista) se conserva como costura.

## Contexto
El producto se reorienta: deja de plantearse como un "CRM de personas" para convertirse
en el **sistema operativo interno de la Academia del CIO**. La unidad conceptual de
trabajo diario pasa a ser **el proceso de una entrevista**, y la **Pipeline** se convierte
en el centro de la aplicación.

En el código actual, el tablero solo usaba `Persona.estadoRelacion`; la "vista combinada
de dos ciclos" que planteaba 0004 aún **no estaba construida** (el modelo `Entrevista`
existe pero no tiene UI). Eso hace viable un cambio limpio e incremental sin rediseño.

El usuario definió cinco etapas nuevas, cada una con la fecha que importa en ese momento:

| Etapa | Significado | Fecha que guarda |
|---|---|---|
| **Contactados** | Primer contacto enviado; pendientes de responder | — |
| **Interesados** | Han respondido positivamente | Fecha de la llamada |
| **Confirmados** | Entrevista cerrada | Fecha de la entrevista |
| **Entrevistados** | Entrevista realizada | Fecha prevista de publicación |
| **Impacto** | Entrevista publicada | — (futuro: estadísticas automáticas) |

## Decisión
1. **La Persona sigue siendo la entidad principal.** Las cinco etapas y sus fechas
   viven en `Persona` (`estadoRelacion` + `fechaLlamada`, `fechaEntrevista`,
   `fechaPublicacionPrevista`). Cambio mínimo, alineado con el uso diario.
2. **Pipeline como centro.** El tablero es un pipeline lineal único (una columna por
   etapa), no una vista combinada de dos ciclos.
3. **Toda persona nueva entra como `CONTACTADO`.** No hay fase de pre-contacto en esta
   versión: la plataforma empieza cuando alguien ya ha sido contactado manualmente.
4. **`Entrevista` se conserva como costura durmiente** para (a) las automatizaciones de
   "Impacto" (stats de YouTube/LinkedIn, envío de informe) y (b) permitir varias
   entrevistas por persona en el futuro. No se construye UI para ella todavía.
5. **Preparado para prospección automática:** el enum se diseña para poder *prepender*
   una etapa previa (p. ej. `PROSPECTO`) en una migración barata cuando exista el agente
   de LinkedIn que alimente "Contactados". Ninguna lógica asume que "Contactados" sea
   irrevocablemente el primer estado.
6. **Navegación:** se elimina "Personas" del menú, se añade "Dashboard" (placeholder) como
   primera opción y la raíz redirige a `/dashboard`. Las rutas `/personas/*` se conservan
   para alta/edición/detalle (el detalle sigue siendo el *hub* de cada persona).
7. **Identidad visual:** el naranja del logo corporativo (≈ `#EA580C`) se adopta como
   color de acento del sistema de diseño (`--primary`), sobre una base neutra de blancos
   y grises. Se reserva para acciones principales, enlaces activos, foco e indicadores.

## Alternativas consideradas
- **Mantener la vista combinada de dos ciclos (0004 literal)** — más fiel al modelo
  episódico, pero exige construir la UI de `Entrevista` ahora; se pospone hasta que las
  automatizaciones lo justifiquen.
- **Hacer de `Entrevista` la unidad del pipeline** — la más fiel a "la unidad es el
  proceso de la entrevista" y soporta varias entrevistas por persona, pero es un cambio
  mayor (flujo de creación + tablero sobre otra entidad). Se pospone; `Entrevista` queda
  como costura para adoptarlo sin rediseño.
- **Añadir una entidad "Pipeline/Oportunidad"** — pensamiento deal-céntrico, ya descartado
  en 0004 por contrario al principio persona-céntrico.

## Consecuencias
- **Positivas:** cambio pequeño e incremental; el tablero responde a "¿qué hago ahora?";
  cada etapa guarda exactamente la fecha relevante; identidad visual coherente.
- **Negativas / costes:**
  - Se pierde (por ahora) el soporte a varias entrevistas por persona; vuelve a haber un
    único campo de estado. Mitigado: `Entrevista` sigue en el esquema como costura.
  - El nombre `EstadoRelacion` pasa a significar "etapa del pipeline"; ligera imprecisión
    semántica (ver recomendación 3).
  - Las personas que estaban en `Identificado`/`Investigado` se remapearon a `Contactado`
    y ya **no se distinguen**: pérdida de información irreversible, aceptada por diseño.
- **Riesgos y mitigación:** el remapeo del enum en Postgres es delicado; se hizo con un
  `CASE` explícito en la migración `20260701201450_pipeline_nuevos_estados` y se verificó
  en vivo (typecheck/lint/build + smoke test de las páginas contra la BD migrada).

## Recomendaciones para fases posteriores (no implementadas)
Registradas aquí a petición del usuario; requieren su visto bueno antes de construirse.
1. **Automatizaciones de "Impacto":** al integrar stats de YouTube/LinkedIn y el envío de
   informe, reactivar `Entrevista` como unidad episódica y valorar mover allí
   `fechaEntrevista`/`fechaPublicacionPrevista` + las métricas.
2. **Fase de prospección (agente LinkedIn):** prepender un estado `PROSPECTO`/`CONTACTAR`
   (migración: añadir un valor al enum) que alimente automáticamente "Contactados".
3. **Renombrar** `EstadoRelacion → EstadoPipeline` (y `estadoRelacion → estadoPipeline`)
   para que el nombre no mienta; se pospuso para no arrastrar churn en muchos archivos.
4. **Ruta `/personas` (lista):** queda huérfana del menú; decidir si se elimina, se
   convierte en "archivo / todas las personas" o se integra en el Dashboard.
5. **Captura de fechas de etapa:** hoy se editan en el formulario completo; una edición
   inline al mover de columna sería mejor UX.
6. **Dashboard:** definir métricas (conteos por etapa, seguimientos vencidos, próximas
   entrevistas, publicaciones recientes).
