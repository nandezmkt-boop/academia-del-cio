import { z } from "zod";

// Permite cadena vacía (lo que envía un input opcional) o un valor válido.
const emailOpcional = z.union([z.literal(""), z.email("Email no válido")]);
const urlOpcional = z.union([z.literal(""), z.url("URL no válida")]);
const fechaOpcional = z.union([
  z.literal(""),
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha no válida"),
]);

/**
 * Validación de Persona, compartida por alta y edición (fuente de verdad).
 * `estadoRelacion` se gestiona aparte (cambiarEstadoSchema): un alta toma el
 * default CONTACTADO y el cambio de estado es una acción dedicada.
 */
export const personaSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre es obligatorio").max(200),
  email: emailOpcional,
  empresaActual: z.string().trim().max(200).optional(),
  cargoActual: z.string().trim().max(200).optional(),
  linkedinUrl: urlOpcional,
  proximaAccion: z.string().trim().max(500).optional(),
  fechaSeguimiento: fechaOpcional.optional(),
  // Fechas propias de cada etapa del pipeline (ver constants.ts).
  fechaLlamada: fechaOpcional.optional(),
  fechaEntrevista: fechaOpcional.optional(),
  fechaPublicacionPrevista: fechaOpcional.optional(),
  dossier: z.string().trim().max(5000).optional(),
});

export type PersonaInput = z.infer<typeof personaSchema>;

export const cambiarEstadoSchema = z.object({
  estado: z.enum([
    "CONTACTADO",
    "INTERESADO",
    "CONFIRMADO",
    "ENTREVISTADO",
    "IMPACTO",
  ]),
});

export type CambiarEstadoInput = z.infer<typeof cambiarEstadoSchema>;
