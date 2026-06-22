#!/usr/bin/env node
// Hook PreToolUse (matcher: Bash)
// Guardarraíl: ante un comando potencialmente destructivo, NO lo bloquea en seco
// sino que pide CONFIRMACIÓN al usuario (permissionDecision: "ask").
// Pensado para alguien que no puede juzgar qué comando es peligroso.
import { readFileSync } from "node:fs";

let data = {};
try {
  data = JSON.parse(readFileSync(0, "utf8") || "{}");
} catch {
  process.exit(0); // si no hay input parseable, no estorbar
}

const cmd = (data.tool_input && data.tool_input.command) || "";

const DANGER = [
  { re: /\brm\s+-[a-z]*r[a-z]*f|\brm\s+-[a-z]*f[a-z]*r/i, why: "borrado recursivo forzado (rm -rf)" },
  { re: /\bgit\s+reset\s+--hard\b/i, why: "git reset --hard descarta cambios de forma irreversible" },
  { re: /\bgit\s+push\b[^|&]*\s(--force\b|-f\b)/i, why: "git push forzado reescribe la historia remota" },
  { re: /\bgit\s+clean\s+-[a-z]*f/i, why: "git clean -f borra archivos no rastreados" },
  { re: /\bprisma\s+migrate\s+reset\b/i, why: "prisma migrate reset BORRA todos los datos" },
  { re: /--force-reset\b/i, why: "force-reset recrea la base de datos desde cero" },
  { re: /\bprisma\s+migrate\s+deploy\b/i, why: "migrate deploy aplica migraciones (posible producción)" },
  { re: /\bdrop\s+(database|table|schema)\b/i, why: "DROP elimina datos de forma permanente" },
  { re: /\b(mkfs|fdisk)\b|\bformat\s+[a-z]:/i, why: "operación de formateo de disco" },
];

for (const d of DANGER) {
  if (d.re.test(cmd)) {
    process.stdout.write(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          permissionDecision: "ask",
          permissionDecisionReason: `⚠️ Comando potencialmente destructivo: ${d.why}.\nConfirma SOLO si estás completamente seguro de lo que hace.`,
        },
      })
    );
    process.exit(0);
  }
}

process.exit(0);
