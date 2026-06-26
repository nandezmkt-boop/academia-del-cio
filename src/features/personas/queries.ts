import "server-only";

import { db } from "@/lib/db";

/**
 * Lista de personas activas (no archivadas). El filtro `deletedAt: null` lo aplica
 * la extensión de soft-delete en `lib/db.ts`; aquí excluimos además las archivadas.
 */
export async function getPersonas() {
  return db.persona.findMany({
    where: { archivedAt: null },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Una persona por id. Usa findFirst (no findUnique) para que la extensión de
 * soft-delete aplique el filtro `deletedAt: null`. Devuelve null si no existe.
 */
export async function getPersonaById(id: string) {
  return db.persona.findFirst({ where: { id } });
}

export type PersonaListItem = Awaited<ReturnType<typeof getPersonas>>[number];
