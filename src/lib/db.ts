import { PrismaClient } from "@prisma/client";
import { env } from "@/lib/env";

// Importar `env` aquí valida DATABASE_URL/DIRECT_URL al cargar la capa de datos.
void env;

/**
 * Cliente Prisma con extensión de SOFT DELETE (ADR 0005).
 *
 * V1 implementa el FILTRADO en lecturas: las consultas (findMany/findFirst/count)
 * excluyen automáticamente los registros con `deletedAt` distinto de null, así nadie
 * tiene que acordarse de filtrar. La conversión de `delete` → `update(deletedAt)` se
 * añadirá cuando exista la funcionalidad de borrado/archivado (slice posterior).
 *
 * Nota: `findUnique` no se filtra (consulta por id); usar `findFirst` si se necesita
 * excluir borrados por otros campos.
 */
function createPrismaClient() {
  return new PrismaClient().$extends({
    query: {
      $allModels: {
        async findMany({ args, query }) {
          args.where = { deletedAt: null, ...args.where };
          return query(args);
        },
        async findFirst({ args, query }) {
          args.where = { deletedAt: null, ...args.where };
          return query(args);
        },
        async findFirstOrThrow({ args, query }) {
          args.where = { deletedAt: null, ...args.where };
          return query(args);
        },
        async count({ args, query }) {
          args.where = { deletedAt: null, ...args.where };
          return query(args);
        },
      },
    },
  });
}

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
