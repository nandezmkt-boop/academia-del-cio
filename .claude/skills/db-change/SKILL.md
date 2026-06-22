---
name: db-change
description: Realiza cambios de base de datos de forma segura con Prisma — editar schema.prisma, generar y revisar la migración, aplicar SOLO a desarrollo, nunca a producción a mano. Úsalo para cualquier cambio de esquema (añadir/quitar campos, tablas o relaciones) en la Academia del CIO.
---

# Skill: db-change

Raíl de seguridad sobre la operación más peligrosa del proyecto. El usuario no puede
juzgar qué comando de BD es destructivo: tú sí, y aquí está el camino seguro.

## Cuándo se usa
Cualquier cambio del esquema de datos: nuevo campo, nueva tabla/modelo, relación,
índice o cambio de tipo.

## Proceso (síguelo en orden)

1. **Confirma el cambio en el dominio.** Lee `docs/domain.md`. Si el cambio modifica
   el modelo conceptual, actualiza ese doc primero (o a la vez).

2. **Edita `prisma/schema.prisma`.** Un cambio pequeño y claro cada vez. Explica en
   lenguaje natural qué representa el cambio.

3. **Genera la migración en DESARROLLO:**
   ```
   npx prisma migrate dev --name <descripcion-corta>
   ```
   Esto crea la migración y la aplica a la BD de desarrollo.

4. **Revisa la migración generada** (`prisma/migrations/.../migration.sql`).
   Resume al usuario en lenguaje natural qué hará. Si destruye datos (DROP o ALTER
   que borra columnas), avísalo de forma explícita ANTES de continuar.

5. **Regenera el cliente** si hace falta: `npx prisma generate`.

## Reglas innegociables
- ❌ NUNCA `prisma migrate reset`, `--force-reset` ni `migrate deploy` contra producción
  desde aquí. (El hook de guardarraíl te pedirá confirmación; respétalo.)
- ❌ NUNCA editar a mano archivos en `prisma/migrations/` ya creados (historial inmutable).
- ✅ Producción se actualiza por el flujo de despliegue, no a mano.
- ✅ Ante la duda, para y pregunta al usuario antes de tocar datos.
