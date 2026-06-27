import { z } from "zod";

/**
 * Validación de una interacción (fuente de verdad, compartida alta/edición).
 * `resumen` es obligatorio: es el activo narrativo del timeline (combustible de IA).
 */
export const interaccionSchema = z.object({
  canal: z.enum(["EMAIL", "LINKEDIN", "LLAMADA", "REUNION", "NOTA", "OTRO"]),
  direccion: z.enum(["ENTRANTE", "SALIENTE", "INTERNA"]),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha no válida"),
  resumen: z.string().trim().min(1, "El resumen es obligatorio").max(5000),
  resultado: z.string().trim().max(1000).optional(),
});

export type InteraccionInput = z.infer<typeof interaccionSchema>;
