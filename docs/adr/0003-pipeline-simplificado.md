# 0003 — Pipeline simplificado (11 → 6 estados)

- **Estado:** Aceptado
- **Fecha:** 2026-06-16
- **Decisores:** Usuario (product owner) + Claude (arquitecto)

## Contexto
La propuesta inicial tenía 11 estados (Identificado, Investigado, Contactado,
Respuesta recibida, Llamada agendada, Interesado, Fecha pendiente, Fecha cerrada,
Grabado, Publicado, Informe enviado). Pipelines largos generan fricción y datos
sucios: nadie actualiza estados que no cambian una decisión.

## Decisión
Reducir a **6 estados** + campos:
Identificado · Investigado · Contactado · En conversación · Agendado · Grabado · Publicado.
- "Respuesta recibida / Llamada agendada / Interesado" → se absorben en **En conversación**
  (el matiz vive en la última interacción).
- "Fecha pendiente / Fecha cerrada" → **Agendado** + campo `fecha_confirmada`.
- "Informe enviado" → marca de cierre sobre la entrevista, no un estado.

## Alternativas consideradas
- Mantener los 11 estados: máxima granularidad, pero fricción alta y datos poco fiables.

## Consecuencias
- Positivas: menos fricción, datos más limpios, cada estado responde a "¿qué hago ahora?".
- Negativas: parte del matiz se traslada a campos/interacciones (hay que diseñarlos bien en Fase 1).
- Detalle vivo en `docs/pipeline.md`.
