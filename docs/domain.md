# Modelo de dominio y glosario — Academia del CIO

> Documento durable. Modelo **validado** a nivel de negocio (Fase 1). El esquema
> técnico (Prisma) se deriva de aquí en un paso posterior; este documento manda.

## Insight central
Esto **no es un CRM de ventas**. Un CRM tradicional gira en torno a un *deal* que
cierra (dinero) y el contacto es un medio. Aquí el objeto de valor es **la relación
con una persona, y es perpetua**: la entrevista y el contenido son *episodios*
dentro de una relación que continúa. Tres consecuencias de modelado:

1. **Persona-céntrico**, no deal-céntrico.
2. **Dos ciclos de vida entrelazados** (relación + producción de entrevista), no uno.
3. El activo real es la **memoria narrativa** (timeline + dossier), diseñada para
   alimentar IA. Se captura *texto e intención*, no solo flags de estado.

## Los dos ciclos de vida
- **Estado de la relación** — vive en la **Persona**; es perpetuo y solo describe
  **progreso**: `Identificado → Investigado → Contactado → En conversación → Entrevistado`.
  - "Archivado" NO es un estado: se representa con `archivedAt` (ortogonal al embudo).
  - "Inactivo" NO se almacena: se **deriva** (seguimiento vencido o N días sin contacto).
  - Ver `adr/0005-convenciones-de-datos.md`.
- **Estado de producción** — vive en cada **Entrevista**; es episódico:
  `Propuesta → Agendada → Grabada → Publicada` (+ `informeEnviado`).

El "tablero" que se ve a diario es una **vista combinada** de ambos (presentación);
por debajo se guardan en dos sitios distintos. Detalle en `pipeline.md`.
Motivo de la separación: un líder ya `Publicado` al que se le hace una segunda
entrevista no puede estar a la vez `Publicado` y `En conversación` en un único campo.

## Glosario
- **Persona / Líder:** el ser humano entrevistable. Centro de gravedad; persiste
  haga 0 o N entrevistas. La relación es con la persona, no con su empresa.
- **Interacción:** un punto de contacto concreto (correo, mensaje, llamada, reunión,
  o nota interna). Forma el *timeline* de la relación.
- **Entrevista:** un episodio de grabación con su propio ciclo de producción.
- **Usuario / Miembro:** quien usa el sistema; sostiene la autoría y la responsabilidad.

## Entidades V1 (qué guardan y por qué)

### 🟢 Persona / Líder — imprescindible
La relación es con un humano; todo cuelga de aquí.
- Identidad: nombre, email, LinkedIn / URLs públicas.
- Situación actual: `empresaActual`, `cargoActual` (TEXTO en V1; ver costura abajo).
- Relación: `estadoRelacion`, `responsable` (→Usuario).
- **Próxima acción** (`proximaAccion`, texto) + **`fechaSeguimiento`** — lo que evita
  que un contacto se enfríe. Campo crítico.
- Investigación: `dossier` (texto rico), `temas` (lista simple de expertise).
- Meta: `createdAt`, `updatedAt`, `archivedAt` (archivo de negocio, consultable),
  `deletedAt` (soft delete; nunca borrado físico). Inactividad = derivada, no almacenada.

### 🟢 Interacción — imprescindible
El registro **append-only** que constituye la memoria de la relación y el combustible
de la IA. No se reescribe la historia; se corrige con una nueva interacción.
- `persona` (→Persona), `autor` (→Usuario), `fecha`.
- `canal`: email · LinkedIn · llamada · reunión · **nota interna** · otro.
- `direccion`: entrante · saliente · interna.
- `resumen` (texto: qué se habló / acordó), `resultado` (opcional).
- Nota: las **notas internas** se modelan como una Interacción de canal "nota"
  (conserva autoría sin crear otra entidad).

### 🟢 Entrevista — imprescindible (entidad desde V1)
Separa el episodio de producción de la relación perpetua. Habrá varias por persona
en el tiempo.
- `persona` (→Persona), `estado` (producción), `fecha`, `fechaConfirmada` (bool),
  `responsable` (→Usuario), `informeEnviado` (bool), `notas`.
- Enlaces (pocos campos en V1): p.ej. `enlaceGrabacion`. El módulo de Contenido
  llega después (ver costura).

### 🟢 Usuario / Miembro — imprescindible (mínimo)
Ligado a Supabase Auth. **Sin roles ni permisos complejos** en V1. Existe para
registrar autoría (en interacciones) y responsable (en personas y entrevistas).
- `nombre`, `email`.

## Relaciones V1
- **Persona** 1 → N **Interacción** (el corazón: el histórico).
- **Persona** 1 → N **Entrevista**.
- **Usuario** es `autor` de **Interacción**.
- **Usuario** es `responsable` de **Persona** y de **Entrevista**.

```
Usuario ─(autor)─────────────► Interacción ◄──N── 1 Persona ──1──N──► Entrevista
   └─(responsable)──────────────────────────────────┘   ▲                  │
                                          (responsable) └──────────────────┘
```

## Costuras diseñadas, NO construidas en V1
Cada una se podrá añadir **sin rediseñar** lo existente:
- **Experiencia profesional** (Persona 1→N): historial de cargos/empresas. V1 usa
  `empresaActual`/`cargoActual` como texto; el dominio asume que en el futuro una
  Persona tendrá múltiples experiencias.
- **Oportunidad comercial** (cuelga de Persona): V1 la registra como Interacción/nota;
  no hay entidad comercial todavía.
- **Contenido** (Entrevista 1→N): V1 usa campos de enlace; entidad propia en Fase 5.
- **Temas/Expertise** como entidad con tags: V1 usa lista de texto.
- **Roles/permisos** sobre Usuario: V1 sin roles.

## Qué NO guardamos (trampas evitadas)
- Fichas de contacto exhaustivas (varios teléfonos/direcciones): basta email + LinkedIn.
- Firmographics de empresa, lead scoring, tracking de aperturas/clics: pensamiento de
  CRM de ventas, no aplica.
- Los assets de contenido dentro del sistema: solo se enlazan.

## Estado
Modelo validado con el usuario. Siguiente paso (pendiente de aprobación aparte):
derivar el **schema Prisma** a partir de este documento.
