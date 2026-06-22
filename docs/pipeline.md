# Pipeline de la relación — Academia del CIO

> Documento durable. Define los estados del proceso. **Importante:** lo que parecía
> un único pipeline son en realidad **dos ciclos de vida** (ver `adr/0004-dos-ciclos-de-vida.md`).
> Esta es la evolución del recorte inicial de 11→6 estados (`adr/0003`).

## Por qué dos ciclos y no uno
Un líder puede tener **varias entrevistas a lo largo del tiempo**. Si el estado fuera
un único campo en la Persona, alguien ya `Publicado` al que empiezas una segunda
entrevista no podría estar a la vez `Publicado` y `En conversación`. Por eso el estado
de la **relación** (perpetuo) y el de la **entrevista** (episódico) se guardan aparte.

## Ciclo 1 — Estado de la RELACIÓN (vive en la Persona)
1. **Identificado** — candidato detectado, sin investigar.
2. **Investigado** — estudiado y listo para contactar.
3. **Contactado** — enviado el primer contacto.
4. **En conversación** — diálogo activo (absorbe: respuesta recibida, llamada
   agendada, interesado). El matiz vive en la última *interacción*, no en un estado.
5. **Entrevistado** — ya se ha grabado al menos una entrevista; la relación continúa
   (nurture a largo plazo).

> **Archivado** e **Inactivo** NO son estados de este enum:
> - *Archivado* se representa con `archivedAt` (se puede archivar en cualquier punto del embudo).
> - *Inactivo* se **deriva** (seguimiento vencido o N días sin interacción), no se almacena.
> Ver `adr/0005-convenciones-de-datos.md`.

## Ciclo 2 — Estado de PRODUCCIÓN (vive en cada Entrevista)
1. **Propuesta** — entrevista planteada, sin fecha cerrada.
2. **Agendada** — con `fecha`; `fechaConfirmada` distingue tentativa de confirmada
   (absorbe "fecha pendiente / fecha cerrada").
3. **Grabada** — realizada.
4. **Publicada** — el contenido derivado se ha publicado.
- `informeEnviado` (bool) — marca de cierre sobre la entrevista, **no** un estado.

## El "tablero" diario = vista combinada
Lo que el usuario ve a diario es una sola lista/tablero, pero es una **vista** que
combina ambos ciclos:
- Para un líder **sin entrevista activa**, se muestra su estado de relación.
- Para uno **con entrevista en curso**, se muestra el estado de producción de esa entrevista.
Esto es una decisión de **presentación** (Fase 3), no de almacenamiento.

## Campos asociados (se concretan al derivar el schema)
- En Persona: `estadoRelacion`, `proximaAccion`, `fechaSeguimiento`.
- En Entrevista: `estado`, `fecha`, `fechaConfirmada`, `informeEnviado`.

## Transiciones
Avance normal hacia adelante; se permite retroceder (p.ej. reabrir una conversación).
Sin reglas estrictas de transición por defecto: el estado es una **etiqueta honesta**
del momento, no una máquina de estados rígida. Se endurecerá solo si hace falta.
