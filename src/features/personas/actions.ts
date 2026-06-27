"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { EstadoRelacion } from "@prisma/client";

import { db } from "@/lib/db";
import {
  personaSchema,
  cambiarEstadoSchema,
  type PersonaInput,
} from "./schema";

export type ActionResult =
  | { ok: true; id: string }
  | { ok: false; errors: Record<string, string[]> };

// Revalida todas las vistas que dependen de las personas (lista, tablero y detalle).
function revalidarPersonas(id?: string) {
  revalidatePath("/personas");
  revalidatePath("/pipeline");
  if (id) revalidatePath(`/personas/${id}`);
}

// Normaliza el input del formulario a datos de Prisma (vacíos → null, fecha → Date).
function toPersonaData(d: PersonaInput) {
  return {
    nombre: d.nombre,
    email: d.email || null,
    empresaActual: d.empresaActual || null,
    cargoActual: d.cargoActual || null,
    linkedinUrl: d.linkedinUrl || null,
    proximaAccion: d.proximaAccion || null,
    fechaSeguimiento: d.fechaSeguimiento ? new Date(d.fechaSeguimiento) : null,
    dossier: d.dossier || null,
  };
}

export async function crearPersona(input: PersonaInput): Promise<ActionResult> {
  const parsed = personaSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, errors: z.flattenError(parsed.error).fieldErrors };
  }
  const persona = await db.persona.create({ data: toPersonaData(parsed.data) });
  revalidarPersonas();
  return { ok: true, id: persona.id };
}

export async function actualizarPersona(
  id: string,
  input: PersonaInput
): Promise<ActionResult> {
  const parsed = personaSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, errors: z.flattenError(parsed.error).fieldErrors };
  }
  await db.persona.update({ where: { id }, data: toPersonaData(parsed.data) });
  revalidarPersonas(id);
  return { ok: true, id };
}

export async function cambiarEstadoPersona(
  id: string,
  estado: string
): Promise<ActionResult> {
  const parsed = cambiarEstadoSchema.safeParse({ estado });
  if (!parsed.success) {
    return { ok: false, errors: z.flattenError(parsed.error).fieldErrors };
  }
  await db.persona.update({
    where: { id },
    data: { estadoRelacion: parsed.data.estado as EstadoRelacion },
  });
  revalidarPersonas(id);
  return { ok: true, id };
}

// Archivar = archivedAt (reversible; ADR 0005). NO borra la fila.
export async function archivarPersona(id: string): Promise<ActionResult> {
  await db.persona.update({ where: { id }, data: { archivedAt: new Date() } });
  revalidarPersonas(id);
  return { ok: true, id };
}
