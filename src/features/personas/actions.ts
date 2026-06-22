"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@/lib/db";
import { crearPersonaSchema, type CrearPersonaInput } from "./schema";

export type CrearPersonaResult =
  | { ok: true; id: string }
  | { ok: false; errors: Record<string, string[]> };

/**
 * Server Action: crea una Persona.
 * El servidor SIEMPRE revalida con el mismo schema Zod (no se fía del cliente).
 * Errores de validación → se devuelven como datos para pintarlos en el formulario.
 */
export async function crearPersona(
  input: CrearPersonaInput
): Promise<CrearPersonaResult> {
  const parsed = crearPersonaSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, errors: z.flattenError(parsed.error).fieldErrors };
  }

  const d = parsed.data;
  const persona = await db.persona.create({
    data: {
      nombre: d.nombre,
      email: d.email || null,
      empresaActual: d.empresaActual || null,
      cargoActual: d.cargoActual || null,
      linkedinUrl: d.linkedinUrl || null,
      proximaAccion: d.proximaAccion || null,
      // estadoRelacion: default IDENTIFICADO en BD
    },
  });

  revalidatePath("/personas");
  return { ok: true, id: persona.id };
}
