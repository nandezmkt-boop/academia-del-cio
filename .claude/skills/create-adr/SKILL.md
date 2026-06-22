---
name: create-adr
description: Registra una decisión de arquitectura (ADR) en docs/adr — copia la plantilla, numera secuencialmente y documenta contexto, decisión, alternativas y consecuencias. Úsalo cada vez que se tome una decisión técnica no trivial en la Academia del CIO.
---

# Skill: create-adr

La memoria del proyecto. Las decisiones y su porqué se olvidan; un ADR las conserva
para que ni el usuario ni la IA tengan que re-discutirlas en el futuro.

## Cuándo se usa
Cada vez que se toma una decisión no trivial: elección de librería, patrón de
arquitectura, modelado importante, cambio de un ADR previo, trade-off relevante.
Si dudas si merece ADR: si alguien podría preguntar "¿por qué hicimos esto?", merece ADR.

## Proceso

1. **Mira el índice** `docs/adr/README.md` y averigua el siguiente número (NNNN).
2. **Copia** `docs/adr/0000-template.md` a `docs/adr/NNNN-titulo-en-kebab-case.md`.
3. **Rellena** todas las secciones:
   - Contexto: qué obliga a decidir y qué restricciones aplican.
   - Decisión: en 1-2 frases claras.
   - Alternativas consideradas: con pros/contras honestos.
   - Consecuencias: positivas, costes y riesgos (con mitigación).
4. **Pon estado** `Aceptado` y la fecha de hoy.
5. **Actualiza el índice** en `docs/adr/README.md` con una línea para el nuevo ADR.

## Reglas
- Un ADR no se reescribe ni se borra. Si la decisión cambia, crea uno nuevo con
  estado `Aceptado` y marca el anterior como `Reemplazado por NNNN`.
- Escribe en lenguaje claro: el ADR debe entenderse sin ser experto.
