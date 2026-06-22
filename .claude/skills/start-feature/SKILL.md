---
name: start-feature
description: Inicia una nueva funcionalidad de la Academia del CIO de forma disciplinada — aclara la intención, consulta el dominio en docs/, planifica una rebanada vertical mínima y verifica. Úsalo siempre que el usuario quiera empezar algo nuevo ("quiero poder…", "añade…", "necesito…", "estaría bien que…").
---

# Skill: start-feature

Convierte una petición en lenguaje natural en un proceso de CTO repetible. El usuario
tiene nivel de programación bajo: tu trabajo es aportar el método y la red de seguridad.

## Cuándo se usa
Al empezar cualquier funcionalidad o cambio de comportamiento del producto.

## Proceso (síguelo en orden)

1. **Aclara la intención (2-3 preguntas máximo).**
   - ¿Qué problema real resuelve esto para el usuario del producto?
   - ¿Cuál es el resultado mínimo que ya aportaría valor?
   - Evita asumir. Si la petición es clara, no preguntes por preguntar.

2. **Ánclate en el conocimiento existente.** Antes de proponer nada, lee lo relevante:
   - `docs/domain.md` y `docs/pipeline.md` (modelo y estados).
   - `docs/adr/` si la idea roza una decisión ya tomada.
   - No reinventes conceptos que ya tienen nombre en el glosario.

3. **Planifica una REBANADA VERTICAL mínima.** Lo más pequeño que funcione de punta
   a punta (de la interfaz al dato persistido). Nada de construir "a lo grande".
   Presenta el plan en modo plan y espera aprobación.

4. **Implementa.** Reutiliza patrones existentes. Si tocas el dominio o el pipeline,
   **actualiza el doc correspondiente** como parte del trabajo (los docs no mienten).

5. **Cambios de datos → usa el skill `db-change`.** Nunca toques la BD por fuera de él.

6. **Decisiones no triviales → usa el skill `create-adr`.**

7. **Verifica antes de cerrar.** Ejecuta la app/los tests y comprueba que la rebanada
   funciona de verdad. La puerta de cierre (Stop hook) exigirá que typecheck/tests/build
   estén en verde.

## Antiobjetivos
- No construyas más de lo pedido "por si acaso".
- No dejes el doc desactualizado.
- No persigas perfección: rebanada mínima → verificar → iterar.
