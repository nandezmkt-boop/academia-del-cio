import { env } from "@/lib/env";

/**
 * Sesión sin estado: la cookie solo lleva una firma HMAC, nunca la contraseña.
 * Usa Web Crypto (`crypto.subtle`) en vez de `node:crypto` porque este módulo
 * se importa tanto desde el middleware (runtime Edge) como desde las Server
 * Actions (runtime Node), y la Web Crypto API es la única API común a ambos.
 *
 * Punto de sustitución futuro: al adoptar Supabase Auth, este módulo (y
 * login/logout en actions.ts) es lo único que hay que reemplazar.
 */

export const SESSION_COOKIE = "cio_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 días

const SESSION_PAYLOAD = "cio-admin";

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function sign(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(env.SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload)
  );
  return toHex(signature);
}

function timingSafeEqualString(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function createSessionToken(): Promise<string> {
  return sign(SESSION_PAYLOAD);
}

export async function isValidSessionToken(
  token: string | undefined
): Promise<boolean> {
  if (!token) return false;
  const expected = await createSessionToken();
  return timingSafeEqualString(token, expected);
}
