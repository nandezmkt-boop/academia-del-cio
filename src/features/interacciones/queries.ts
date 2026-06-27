import "server-only";

import { db } from "@/lib/db";

/**
 * Timeline de interacciones de una persona (append-only; las soft-deleted las
 * excluye la extensión de lib/db.ts). Orden cronológico descendente.
 */
export async function getInteraccionesByPersona(personaId: string) {
  return db.interaccion.findMany({
    where: { personaId },
    orderBy: { fecha: "desc" },
    include: { autor: { select: { nombre: true } } },
  });
}

export type InteraccionConAutor = Awaited<
  ReturnType<typeof getInteraccionesByPersona>
>[number];
