# 0009 — Autenticación mínima por contraseña única de administrador

- **Estado:** Aceptado
- **Fecha:** 2026-07-02
- **Decisores:** Usuario (product owner) + Claude (arquitecto)
- **Relación:** resuelve la autenticación diferida en
  `docs/adr/0007-autor-interacciones-propietario.md` ("la autenticación sigue
  diferida"); no toca el `Usuario` propietario sembrado en ese ADR.

## Contexto
Cualquiera que conociera la URL de despliegue podía acceder a la app: no
existía ninguna capa de acceso. El usuario pidió una barrera mínima —una sola
contraseña de administrador— sin construir un sistema de usuarios, sesiones
en base de datos ni OAuth, y que fuera fácilmente sustituible por Supabase
Auth el día que se necesiten usuarios reales.

## Decisión
Sesión sin estado: una cookie firmada con HMAC-SHA256 marca al visitante como
autenticado. La firma usa `SESSION_SECRET`, una clave de firma independiente
de `ADMIN_PASSWORD` (que solo sirve para validar el login); así, rotar la
contraseña no invalida las sesiones activas y viceversa. La cookie no
contiene la contraseña, solo la firma. La duración de la cookie es de 30 días
para no pedir la contraseña en cada visita.

La firma se calcula con la Web Crypto API (`crypto.subtle`), no con
`node:crypto`, porque el mismo código se ejecuta tanto en el proxy/middleware
de Next.js (runtime Edge) como en las Server Actions de login/logout (runtime
Node) — Web Crypto es la única API común a ambos runtimes.

Los intentos fallidos de login se frenan con un retraso exponencial en
memoria del proceso (1 s, 2 s, 4 s… con un tope de 30 s), sin persistencia en
base de datos: es un único usuario administrador, así que un contador global
de proceso basta para frenar intentos automatizados.

Toda la lógica vive en `src/features/auth/` (`schema.ts`, `session.ts`,
`rate-limit.ts`, `actions.ts`) y se consume solo desde
`src/proxy.ts` (el gate de rutas) y desde el formulario de login/el botón de
logout. Ningún Server Component ni componente de UI consulta la sesión
directamente.

## Alternativas consideradas
- **JWT con librería (`jose`)** — formato estándar y más flexible (claims,
  expiración embebida), pero añade una dependencia y complejidad para un caso
  de uso de una sola credencial fija; el HMAC a mano cubre lo mismo con menos
  código.
- **Tabla de sesiones en BD** — permitiría revocar sesiones individuales y
  sería el paso natural hacia un sistema multiusuario, pero es
  sobre-ingeniería para un único administrador y añade una migración de
  schema para algo que no se necesita todavía.
- **Guardar la contraseña directamente en la cookie** — más simple, pero
  insegura: expondría la contraseña en el navegador (DevTools, cualquier XSS).
  Se descartó de inmediato.
- **Auth real ya (Supabase Auth)** — resuelve el problema de raíz, pero amplía
  el alcance mucho más de lo pedido para esta rebanada; queda como evolución
  natural (ver Consecuencias).

## Consecuencias
- Positivas: cero dependencias nuevas, cero tablas nuevas, cero estado
  compartido; rotar `ADMIN_PASSWORD` o `SESSION_SECRET` es solo cambiar una
  env var; el punto de sustitución está aislado en un único módulo.
- Negativas / costes: el freno de intentos es por proceso (se reinicia al
  redeployar) y global (no por IP/usuario) — aceptable para un único admin y
  un panel interno de bajo tráfico, pero no serviría para un sistema
  multiusuario expuesto públicamente.
- Riesgos y mitigación: si `SESSION_SECRET` se filtra, cualquiera puede
  forjar una sesión válida — se mitiga tratándolo como secreto (no se sube a
  git, solo vive en `.env`/variables de entorno del hosting).
- Reconciliación futura: al adoptar Supabase Auth, se sustituye
  `src/features/auth/session.ts` y el `login`/`logout` de `actions.ts` por
  llamadas a `supabase.auth.*`; el resto de la app (proxy, sidebar, páginas)
  no necesita cambios porque ya trata la sesión como una caja negra. La
  reconciliación con el `Usuario` propietario sembrado (ADR 0007) queda
  pendiente para ese momento, tal como ya preveía ese ADR.
