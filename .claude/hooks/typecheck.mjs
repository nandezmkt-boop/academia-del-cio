#!/usr/bin/env node
// Hook Stop
// Comprueba tipos con `tsc --noEmit` antes de dar el trabajo por terminado.
// Si hay errores de tipo, bloquea el cierre (exit 2) y devuelve el detalle a Claude.
// Degrada en silencio si aún no hay tooling.
import { readFileSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";

let data = {};
try {
  data = JSON.parse(readFileSync(0, "utf8") || "{}");
} catch {
  process.exit(0);
}

// Evita bucles: si ya estamos dentro de un Stop hook, no re-bloquear.
if (data.stop_hook_active) process.exit(0);

if (!existsSync("tsconfig.json") || !existsSync("node_modules")) process.exit(0);

try {
  execSync("npx --no-install tsc --noEmit", { stdio: "pipe" });
} catch (e) {
  const out = (e.stdout ? e.stdout.toString() : "") + (e.stderr ? e.stderr.toString() : "");
  process.stderr.write("❌ Errores de tipo (tsc --noEmit). Corrígelos antes de cerrar:\n" + out.slice(0, 4000));
  process.exit(2);
}
process.exit(0);
