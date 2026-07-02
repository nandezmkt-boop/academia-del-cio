"use server";

import { timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { env } from "@/lib/env";
import { loginSchema, type LoginInput } from "./schema";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  createSessionToken,
} from "./session";
import {
  getRemainingDelayMs,
  registerFailedAttempt,
  resetAttempts,
} from "./rate-limit";

export type LoginResult = { ok: true } | { ok: false; error: string };

function passwordsMatch(input: string, expected: string): boolean {
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function login(input: LoginInput): Promise<LoginResult> {
  const remaining = getRemainingDelayMs();
  if (remaining > 0) {
    return {
      ok: false,
      error: `Demasiados intentos. Espera ${Math.ceil(remaining / 1000)} s.`,
    };
  }

  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Introduce la contraseña" };
  }

  if (!passwordsMatch(parsed.data.password, env.ADMIN_PASSWORD)) {
    registerFailedAttempt();
    return { ok: false, error: "Contraseña incorrecta" };
  }

  resetAttempts();

  const store = await cookies();
  store.set(SESSION_COOKIE, await createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  redirect("/dashboard");
}

export async function logout(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/login");
}
