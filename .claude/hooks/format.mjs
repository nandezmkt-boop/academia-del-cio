#!/usr/bin/env node
// Hook PostToolUse (matcher: Edit|Write|MultiEdit)
// Formatea automáticamente el archivo editado con Prettier.
// Degrada en silencio si aún no hay tooling (Fase 0/1 sin dependencias instaladas).
import { readFileSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";

let data = {};
try {
  data = JSON.parse(readFileSync(0, "utf8") || "{}");
} catch {
  process.exit(0);
}

// Sin proyecto Node instalado todavía → no-op.
if (!existsSync("package.json") || !existsSync("node_modules")) process.exit(0);

const ti = data.tool_input || {};
const fp = ti.file_path || ti.path || "";
if (!fp || !/\.(ts|tsx|js|jsx|mjs|cjs|json|css|scss|md|mdx)$/i.test(fp)) process.exit(0);

try {
  execSync(`npx --no-install prettier --write "${fp}"`, { stdio: "ignore" });
} catch {
  // Prettier no instalado o falló: no estorbar.
}
process.exit(0);
