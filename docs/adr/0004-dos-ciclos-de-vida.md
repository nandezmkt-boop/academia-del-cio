# 0004 — Dos ciclos de vida (relación vs producción de entrevista)

- **Estado:** Aceptado · **parcialmente reemplazado por [0008](./0008-reorientacion-pipeline-entrevista.md)**
  (el tablero diario pasa a ser un **pipeline único** sobre `Persona`; la separación de
  almacenamiento Persona/Entrevista se conserva como costura, pero la "vista combinada"
  descrita abajo queda pospuesta).
- **Fecha:** 2026-06-17
- **Decisores:** Usuario (product owner) + Claude (arquitecto)
- **Relación:** refina y expande `0003-pipeline-simplificado.md` (que sigue vigente
  en cuanto a la simplificación de estados).

## Contexto
Al validar el modelo de dominio (Fase 1), el usuario confirmó que un mismo líder
podrá tener **varias entrevistas a lo largo del tiempo**. Con un único campo de
estado en la Persona, un líder ya `Publicado` al que se inicia una segunda entrevista
no podría representarse (estaría `Publicado` y `En conversación` a la vez). El pipeline
de 6 estados mezclaba, de hecho, dos procesos distintos.

## Decisión
Separar el estado en **dos ciclos de vida** que se guardan por separado:
- **Estado de la relación** (en `Persona`): Identificado → Investigado → Contactado →
  En conversación → Entrevistado (+ Inactivo/Archivado).
- **Estado de producción** (en `Entrevista`): Propuesta → Agendada → Grabada →
  Publicada (+ `informeEnviado`).

El tablero operativo diario será una **vista combinada** de ambos (presentación),
no un campo único de almacenamiento.

## Alternativas consideradas
- **Un único campo de estado en la Persona** (ADR 0003 literal): más simple, pero se
  rompe con entrevistas repetidas; obligaría a rediseñar al crecer. Descartado por la
  respuesta del usuario.
- **Modelar el pipeline como entidad "Oportunidad"** (estilo CRM de ventas): introduce
  pensamiento deal-céntrico, contrario al principio persona-céntrico. Descartado.

## Consecuencias
- Positivas: soporta entrevistas múltiples sin rediseño; cada estado responde a una
  pregunta clara; alinea el dato con el principio persona-céntrico.
- Negativas/costes: la vista de "tablero" debe combinar dos fuentes (trabajo de
  presentación en Fase 3).
- Detalle vivo en `docs/pipeline.md` y `docs/domain.md`.
