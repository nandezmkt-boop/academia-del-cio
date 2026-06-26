import type { EstadoRelacion } from "@prisma/client";

/**
 * Etiquetas y orden de los estados de relación. Fuente única reutilizada por
 * la tabla, el header del detalle y el selector de estado.
 */
export const ESTADO_RELACION: Record<
  EstadoRelacion,
  { label: string; orden: number }
> = {
  IDENTIFICADO: { label: "Identificado", orden: 1 },
  INVESTIGADO: { label: "Investigado", orden: 2 },
  CONTACTADO: { label: "Contactado", orden: 3 },
  EN_CONVERSACION: { label: "En conversación", orden: 4 },
  ENTREVISTADO: { label: "Entrevistado", orden: 5 },
};

export const ESTADOS_RELACION = (
  Object.keys(ESTADO_RELACION) as EstadoRelacion[]
).sort((a, b) => ESTADO_RELACION[a].orden - ESTADO_RELACION[b].orden);
