import type { EstadoRelacion } from "@prisma/client";

/** Campos de fecha de Persona que puede guardar una etapa del pipeline. */
export type CampoFechaPersona =
  | "fechaLlamada"
  | "fechaEntrevista"
  | "fechaPublicacionPrevista";

type EstadoConfig = {
  label: string;
  orden: number;
  /** Descripción corta de la etapa (columna del tablero). */
  descripcion: string;
  /**
   * Fecha propia de la etapa, si la tiene. `Contactados` e `Impacto` no guardan
   * fecha en V1 (Impacto alojará las estadísticas automáticas en el futuro).
   */
  fecha?: { campo: CampoFechaPersona; label: string; labelCorto: string };
};

/**
 * Etiquetas, orden y fecha de cada estado del pipeline. Fuente única reutilizada
 * por el tablero, la tabla, el header del detalle, el selector y el formulario.
 * Toda persona nueva entra como `CONTACTADO` (no hay pre-contacto en V1).
 */
export const ESTADO_RELACION: Record<EstadoRelacion, EstadoConfig> = {
  CONTACTADO: {
    label: "Contactados",
    orden: 1,
    descripcion: "Primer contacto enviado; pendientes de responder.",
  },
  INTERESADO: {
    label: "Interesados",
    orden: 2,
    descripcion: "Han respondido positivamente.",
    fecha: {
      campo: "fechaLlamada",
      label: "Fecha de la llamada",
      labelCorto: "Llamada",
    },
  },
  CONFIRMADO: {
    label: "Confirmados",
    orden: 3,
    descripcion: "Entrevista cerrada.",
    fecha: {
      campo: "fechaEntrevista",
      label: "Fecha de la entrevista",
      labelCorto: "Entrevista",
    },
  },
  ENTREVISTADO: {
    label: "Entrevistados",
    orden: 4,
    descripcion: "Entrevista realizada.",
    fecha: {
      campo: "fechaPublicacionPrevista",
      label: "Fecha prevista de publicación",
      labelCorto: "Publicación",
    },
  },
  IMPACTO: {
    label: "Impacto",
    orden: 5,
    descripcion: "Entrevista publicada.",
  },
};

export const ESTADOS_RELACION = (
  Object.keys(ESTADO_RELACION) as EstadoRelacion[]
).sort((a, b) => ESTADO_RELACION[a].orden - ESTADO_RELACION[b].orden);

/** Campos de fecha del pipeline, en orden, para recorrerlos en formularios. */
export const CAMPOS_FECHA_PIPELINE = ESTADOS_RELACION.flatMap((estado) =>
  ESTADO_RELACION[estado].fecha ? [ESTADO_RELACION[estado].fecha!] : []
);
