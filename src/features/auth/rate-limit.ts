/**
 * Freno simple a intentos de login por fuerza bruta: retraso exponencial en
 * memoria del proceso (sin BD). Al ser un único admin, un contador global es
 * suficiente; se reinicia al reiniciar el servidor, lo cual es aceptable para
 * esta primera capa (ver plan de autenticación).
 */

const BASE_DELAY_MS = 1000;
const MAX_DELAY_MS = 30_000;

let failedAttempts = 0;
let blockedUntil = 0;

export function getRemainingDelayMs(): number {
  return Math.max(0, blockedUntil - Date.now());
}

export function registerFailedAttempt(): void {
  failedAttempts += 1;
  const delay = Math.min(BASE_DELAY_MS * 2 ** (failedAttempts - 1), MAX_DELAY_MS);
  blockedUntil = Date.now() + delay;
}

export function resetAttempts(): void {
  failedAttempts = 0;
  blockedUntil = 0;
}
