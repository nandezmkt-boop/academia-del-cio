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
    ADMIN_PASSWORD: z.string().min(1),
    SESSION_SECRET: z.string().min(16),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_URL: process.env.DIRECT_URL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    SESSION_SECRET: process.env.SESSION_SECRET,
  },
  emptyStringAsUndefined: true,
});
