"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { CanalInteraccion, DireccionInteraccion } from "@prisma/client";

import { db } from "@/lib/db";
import { interaccionSchema, type InteraccionInput } from "./schema";

export type ActionResult =
  | { ok: true; id: string }
  | { ok: false; errors: Record<string, string[]> };

// V1 sin auth: autor = único Usuario propietario (sembrado, ADR 0007).
async function getOwnerId(): Promise<string | null> {
  const owner = await db.usuario.findFirst();
  return owner?.id ?? null;
}

function toData(d: InteraccionInput) {
  return {
    canal: d.canal as CanalInteraccion,
    direccion: d.direccion as DireccionInteraccion,
    fecha: new Date(d.fecha),
    resumen: d.resumen,
    resultado: d.resultado || null,
  };
}

export async function crearInteraccion(
  personaId: string,
  input: InteraccionInput
): Promise<ActionResult> {
  const parsed = interaccionSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, errors: z.flattenError(parsed.error).fieldErrors };
  }
  const autorId = await getOwnerId();
  if (!autorId) {
    return {
      ok: false,
      errors: { _: ["No hay usuario propietario. Ejecuta `npx prisma db seed`."] },
    };
  }
  const interaccion = await db.interaccion.create({
    data: { personaId, autorId, ...toData(parsed.data) },
  });
  revalidatePath(`/personas/${personaId}`);
  return { ok: true, id: interaccion.id };
}

export async function editarInteraccion(
  id: string,
  personaId: string,
  input: InteraccionInput
): Promise<ActionResult> {
  const parsed = interaccionSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, errors: z.flattenError(parsed.error).fieldErrors };
  }
  await db.interaccion.update({ where: { id }, data: toData(parsed.data) });
  revalidatePath(`/personas/${personaId}`);
  return { ok: true, id };
}

// Append-only: "eliminar" = soft-delete (no borra la fila).
export async function eliminarInteraccion(
  id: string,
  personaId: string
): Promise<ActionResult> {
  await db.interaccion.update({ where: { id }, data: { deletedAt: new Date() } });
  revalidatePath(`/personas/${personaId}`);
  return { ok: true, id };
}
