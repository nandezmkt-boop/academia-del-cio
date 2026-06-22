#!/usr/bin/env node
// Hook Stop — "puerta de cierre"
// Ejecuta tests y build (si existen como scripts en package.json) antes de cerrar.
// Si fallan, bloquea el cierre (exit 2) y devuelve el detalle a Claude.
// Degrada en silencio mientras no haya tooling ni scripts definidos.
import { readFileSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";

let data = {};
try {
  data = JSON.parse(readFileSync(0, "utf8") || "{}");
} catch {
  process.exit(0);
}

if (data.stop_hook_active) process.exit(0); // evitar bucles
if (!existsSync("package.json") || !existsSync("node_modules")) process.exit(0);

let scripts = {};
try {
  scripts = JSON.parse(readFileSync("package.json", "utf8")).scripts || {};
} catch {
  process.exit(0);
}

// Nota: NO se ejecuta `next build` en cada cierre (lento). El build completo se
// reserva para el despliegue. Aquí solo lint + tests (rápidos). typecheck.mjs cubre tipos.
const steps = [];
if (scripts.test) steps.push(["tests", "npm test --silent"]);
if (scripts.lint) steps.push(["lint", "npm run lint"]);

for (const [name, cmd] of steps) {
  try {
    execSync(cmd, { stdio: "pipe" });
  } catch (e) {
    const out = (e.stdout ? e.stdout.toString() : "") + (e.stderr ? e.stderr.toString() : "");
    process.stderr.write(`❌ Falla "${name}" antes de cerrar. Corrígelo:\n` + out.slice(0, 4000));
    process.exit(2);
  }
}
process.exit(0);
