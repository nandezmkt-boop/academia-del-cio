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

export type PersonaListItem = Awaited<ReturnType<typeof getPersonas>>[number];
