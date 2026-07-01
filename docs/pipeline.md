# Pipeline de la Academia del CIO

> Documento durable. Define las etapas del proceso. **El Pipeline es el centro del
> producto.** Evolución: 11→6 estados (`adr/0003`) → dos ciclos (`adr/0004`) →
> **pipeline único de entrevista** (`adr/0008`, vigente).

## El pipeline (vive en la Persona)
Un pipeline lineal único; cada etapa guarda la fecha que importa en ese momento.
La entidad principal sigue siendo la **Persona** (`Persona.estadoRelacion`).

1. **Contactados** — primer contacto enviado; pendientes de responder. *(Sin fecha.)*
2. **Interesados** — han respondido positivamente. → `fechaLlamada`.
3. **Confirmados** — la entrevista está cerrada. → `fechaEntrevista`.
4. **Entrevistados** — la entrevista ya se ha realizado. → `fechaPublicacionPrevista`.
5. **Impacto** — la entrevista ya ha sido publicada. *(Sin fecha; en el futuro alojará
   las estadísticas automáticas de YouTube/LinkedIn y el envío del informe.)*

**Entrada al pipeline:** toda persona nueva se crea directamente en **Contactados**.
No hay fase de pre-contacto en esta versión: la plataforma empieza cuando alguien ya ha
sido contactado manualmente.

> **Archivado** e **Inactivo** NO son etapas del enum:
> - *Archivado* se representa con `archivedAt` (se puede archivar en cualquier punto).
> - *Inactivo* se **deriva** (seguimiento vencido o N días sin interacción), no se almacena.
> Ver `adr/0005-convenciones-de-datos.md`.

## Campos asociados (en Persona)
- `estadoRelacion` — la etapa actual del pipeline.
- `fechaLlamada`, `fechaEntrevista`, `fechaPublicacionPrevista` — la fecha propia de cada
  etapa (una por estado que la necesita).
- `proximaAccion`, `fechaSeguimiento` — lo que evita que un contacto se enfríe.

## Transiciones
Avance normal hacia adelante; se permite retroceder. Sin reglas estrictas de transición:
el estado es una **etiqueta honesta** del momento, no una máquina de estados rígida.
Se endurecerá solo si hace falta. La fecha de cada etapa se edita hoy en el formulario
de la Persona.

## Costura: ciclo de producción de la Entrevista (durmiente)
El modelo `Entrevista` (`Propuesta → Agendada → Grabada → Publicada` + `informeEnviado`)
**sigue en el esquema pero sin UI**. Se conserva como punto de extensión para, sin
rediseño (ver `adr/0008` y `adr/0004`):
- las **automatizaciones de "Impacto"** (stats + informe), que son por-entrevista, y
- permitir **varias entrevistas por persona** a lo largo del tiempo.

## Preparado para el futuro (no construido)
- **Prospección automática (agente de LinkedIn):** el enum se diseñó para poder
  *prepender* una etapa previa (p. ej. `PROSPECTO`) mediante una migración barata, que
  alimentaría "Contactados" sin romper la arquitectura.
