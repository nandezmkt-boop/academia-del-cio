import { z } from "zod";

// Permite cadena vacía (lo que envía un input de texto opcional) o un valor válido.
const emailOpcional = z.union([z.literal(""), z.email("Email no válido")]);
const urlOpcional = z.union([z.literal(""), z.url("URL no válida")]);

/**
 * Validación para crear una Persona (fuente de verdad, compartida cliente/servidor).
 * `estadoRelacion` NO está aquí: una persona nueva toma el default IDENTIFICADO en BD.
 */
export const crearPersonaSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre es obligatorio").max(200),
  email: emailOpcional,
  empresaActual: z.string().trim().max(200).optional(),
  cargoActual: z.string().trim().max(200).optional(),
  linkedinUrl: urlOpcional,
  proximaAccion: z.string().trim().max(500).optional(),
});

export type CrearPersonaInput = z.infer<typeof crearPersonaSchema>;
