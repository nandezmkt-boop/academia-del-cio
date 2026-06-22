#!/usr/bin/env node
// Hook PreToolUse (matcher: Edit|Write|MultiEdit)
// Protege archivos sensibles: pide confirmación antes de editarlos.
import { readFileSync } from "node:fs";

let data = {};
try {
  data = JSON.parse(readFileSync(0, "utf8") || "{}");
} catch {
  process.exit(0);
}

const ti = data.tool_input || {};
const fp = ti.file_path || ti.path || "";
const norm = String(fp).replace(/\\/g, "/");

const PROTECTED = [
  { re: /(^|\/)\.env(\.|$)/i, why: "archivo de secretos (.env)" },
  { re: /prisma\/migrations\//i, why: "historial de migraciones (no se edita a mano)" },
  { re: /(production|prod)[^/]*\.(env|json|ya?ml|config\.[jt]s)$/i, why: "configuración de producción" },
];

for (const p of PROTECTED) {
  if (p.re.test(norm)) {
    process.stdout.write(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          permissionDecision: "ask",
          permissionDecisionReason: `⚠️ Vas a editar ${p.why}: ${fp}\nConfirma solo si es intencionado.`,
        },
      })
    );
    process.exit(0);
  }
}

process.exit(0);
