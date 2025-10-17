# Despliegue en Vercel — guía rápida

Pasos recomendados para desplegar este proyecto en Vercel:

1. Variables de entorno (Project Settings → Environment Variables):
   - `PRISMA_DATABASE_URL` = (la URL de tu postgres o Prisma Data Platform)
   - `POSTGRES_URL` = (opcional, si la usas)
   - `NEXT_TELEMETRY_DISABLED` = `1` (opcional para desactivar telemetría)
   - No definas `NODE_ENV` manualmente. Vercel establece `NODE_ENV=production` en builds y `NODE_ENV=development` en previews.

2. Ajustes de Build:
   - Install Command: `pnpm install`
   - Build Command: `pnpm build`
   - Output Directory: dejar vacío (Next.js detecta automáticamente)

3. Lockfile y pnpm:
   - Este repo usa `pnpm-lock.yaml` generado con pnpm v10. Vercel detectará pnpm y usará la versión apropiada.
   - Si ves un error relacionado con `frozen-lockfile`, asegúrate de que `pnpm-lock.yaml` esté en la rama que estás desplegando.

4. Scripts que se ejecutan durante la build:
   - Prisma ejecuta scripts durante `pnpm install`. Si Vercel requiere aprobación de scripts, ejecuta localmente `pnpm approve-builds` para aprobarlos, o sigue el prompt de Vercel para permitir scripts.

5. Redeploy:
   - Después de configurar las variables, entra al proyecto en Vercel y presiona "Deploy" o empuja un nuevo commit a la rama vinculada.

Si quieres, puedo hacer un pull-request o un commit adicional con más ajustes (por ejemplo, `vercel.json` con rewrites/redirections) o revisar el contenido de la migración SQL antes del despliegue.

---

## Resumen de la migración (schema)

La migración generada crea las siguientes tablas y relaciones principales:

- `User` (id, email, name, password, createdAt) — email único.
- `Item` (id, category, name, brand, style, color, imageUrl, createdAt, userId) — FK -> User(id).
- `Outfit` (id, name, createdAt, userId) — FK -> User(id).
- `OutfitItem` (outfitId, itemId) — PK compuesta (outfitId, itemId), FKs -> Outfit(id), Item(id).

Recomendación: revisa `prisma/migrations/20251017094559_init/migration.sql` antes de importar datos.

