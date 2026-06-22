# Runbook — Configuración de MCPs

> Cómo y cuándo conectar servidores MCP a este proyecto. Principio: **uno a uno,
> solo cuando el flujo lo pida.** Cada MCP suma herramientas, coste de contexto y
> superficie de seguridad. (Ver `adr/0001-eleccion-de-stack.md`.)

## Estado actual
`.mcp.json` está vacío (`{"mcpServers": {}}`) a propósito: todavía no hay cuenta de
Supabase ni proyecto creado. Se activa en la Fase 1.

## Día 1 (Fase 1): Supabase MCP
Permite inspeccionar el esquema y consultar datos de forma asistida.

1. Crear proyecto en Supabase (entorno de **desarrollo**).
2. Generar un **access token** y obtener el `project-ref`.
3. Añadir a `.mcp.json` el servidor de Supabase **en modo solo-lectura** apuntando
   al proyecto de desarrollo (nunca producción). Guardar el token en `.env`, no en `.mcp.json`.
4. Reiniciar Claude Code y verificar que las herramientas del MCP aparecen.

> ⚠️ Seguridad: nunca usar la `service_role` key en el MCP. Scope dev + lectura.

## Más adelante
- **GitHub MCP** — al adoptar flujo de PRs/issues.
- **Browser/Playwright MCP** — Fase 2 (verificación E2E) y Fase 5 (investigación).
- **Sentry MCP** — al estar en producción.

## No instalar
- Scraping de LinkedIn/redes (riesgo legal y fragilidad).
- MCP de web search (Claude Code ya trae WebSearch/WebFetch).
- MCPs "todo en uno" o con write amplio a producción.
