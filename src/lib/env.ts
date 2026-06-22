import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * Validación de variables de entorno en el arranque.
 * Si falta o es inválida una variable de servidor, falla rápido con un mensaje claro
 * (mejor que un error críptico de Prisma en runtime).
 */
export const env = createEnv({
  server: {
    DATABASE_URL: z.url(),
    DIRECT_URL: z.url(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_URL: process.env.DIRECT_URL,
  },
  emptyStringAsUndefined: true,
});
