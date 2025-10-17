# Stylo — Gestor de armario y outfits

Aplicación web para gestionar tu armario, crear y guardar outfits, obtener recomendaciones con IA y visualizar prendas con una superposición AR sencilla.


## Tecnologías clave
## Tecnologías clave
- Framework: Next.js 15 (App Router) + TypeScript
- UI: Tailwind CSS 4 + shadcn/ui (Radix)
- Estado/cliente: React 19
- Back-end/API: Rutas del App Router (route handlers)
- Base de datos: PostgreSQL con Prisma ORM (migrado desde MySQL)
- Autenticación (demo): email/contraseña (hash con bcrypt). El cliente mantiene `{ id, email, name }` en `localStorage` y las peticiones al API envían `x-user-id`. Nota: esto es solo para demo; para producción se recomienda Auth.js (cookies/JWT) u otro sistema seguro.
- Imágenes: almacenadas como Data URL (base64) en DB (campo `Text`). En el alta se comprimen en el cliente.


## Requisitos previos
- Node.js >= 18.17 (recomendado 20+)
- PNPM (o instala con `npm i -g pnpm`)
- PostgreSQL (local, Docker o gestionado)
  - `create-outfit/` — Flujo para crear outfit
  - `save-outfit/` — Guardar outfit (desde selección o IA)
  - `outfits/` — Listado y detalle de outfits guardados
  - `ai-recommendations/` — Recomendaciones con IA (usa tus prendas)
  - `api/` — Rutas API (`auth`, `items`, `outfits`, `recommend-outfit`)
- `components/` — Componentes UI (incluye `category-grid` con hover de detalles)
- `lib/` — Utilidades (Prisma client, tipos, almacenamiento cliente/servidor)
- `prisma/` — Esquema de Prisma y migraciones

## Requisitos previos
- PNPM (o instala con `npm i -g pnpm`)
2) Variables de entorno (.env)
El proyecto usa ahora PostgreSQL y soporta el flujo de Prisma Data Platform. Crea un archivo `.env` en la raíz con al menos estas variables (no subas credenciales reales al repo):

```env
# Conexión a Postgres (forma estándar)
POSTGRES_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# Variable usada por Prisma en este proyecto / en Vercel
PRISMA_DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
```

Notas:
- En Vercel debes añadir `PRISMA_DATABASE_URL` (y `POSTGRES_URL` si la necesitas) en las Environment Variables del proyecto.
- `PRISMA_DATABASE_URL` es la variable que utiliza `prisma` en `prisma/schema.prisma`.
- MySQL 8 (local, Docker o gestionado)


## Configuración
1) Clonar e instalar dependencias
```powershell
4) Prisma: generar cliente y aplicar migraciones

Local (desarrollo):
```powershell
npx prisma generate
npx prisma migrate dev --name init
```

Producción / despliegue:
- En producción usa `npx prisma migrate deploy` para aplicar migraciones sin interacción.
- En Vercel el proyecto ya incluye un `postinstall` que ejecuta `prisma generate` automáticamente durante `pnpm install`, y el script `build` ejecuta `prisma generate && next build`. Si ves errores en Vercel relacionados con Prisma, revisa que `PRISMA_DATABASE_URL` exista en las variables de entorno del proyecto y que el log muestre `prisma generate` completando con éxito.
pnpm install
```

2) Variables de entorno (.env)
Como los archivos `.env` y `.env.example` suelen estar ignorados por Git, crea manualmente un archivo `.env` en la raíz del proyecto con el siguiente contenido mínimo:
## Producción (resumen)
1. Configura `PRISMA_DATABASE_URL` (y/o `POSTGRES_URL`) en las variables de entorno de la plataforma de despliegue (por ejemplo, Vercel).
2. Ejecuta migraciones en el entorno de despliegue: `npx prisma migrate deploy`.
3. Asegúrate de que el `pnpm-lock.yaml` generado con pnpm v10 esté presente en la rama que Vercel deploya (Vercel respeta el lockfile). Luego `pnpm build` (el flujo de build ejecuta `prisma generate` antes de `next build`).

Consejos para Vercel:
- Confirma que en la configuración del proyecto en Vercel tienes añadida la variable `PRISMA_DATABASE_URL` en los entornos adecuados (Production / Preview).
- Si Vercel falla con `ERR_PNPM_OUTDATED_LOCKFILE`, regenera el lockfile con pnpm v10 localmente y commitealo.
- Recomendación: evita importar `@prisma/client` a nivel de módulo en rutas del App Router. Este proyecto usa una función `getPrisma()` en `lib/db.ts` que hace import dinámico y previene bundling/errores en build time.

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
## Solución de problemas (FAQ)
- "Cannot find module '@prisma/client'" o "Cannot find module '.prisma/client/default'":
  - Asegúrate de que `prisma generate` se ejecute durante la instalación en el entorno de despliegue. Este repo incluye `postinstall: prisma generate` y `build: prisma generate && next build`.
  - Revisa los logs de build en Vercel y comprueba que `prisma generate` concluya sin errores.
  - Si Vercel indica errores de lockfile (`ERR_PNPM_OUTDATED_LOCKFILE`), regenera `pnpm-lock.yaml` con pnpm v10 y súbelo.

- Si sigues viendo errores de tiempo de ejecución relacionados con Prisma, pega aquí las primeras 30 líneas del stack trace y las reviso.
```

Ejemplos locales de `DATABASE_URL`:
- Sin contraseña (según tu configuración):
  - `mysql://root@localhost:3306/stylo`
- Con contraseña:
  - `mysql://root:mi_password@localhost:3306/stylo`

3) Base de datos
- Opción Docker (Windows con Docker Desktop):
```powershell
docker run --name stylo-mysql -e MYSQL_ROOT_PASSWORD=tu_password -e MYSQL_DATABASE=stylo -p 3306:3306 -d mysql:8
```
- O crea la BD `stylo` en tu servidor MySQL local/gestionado y usa su conexión.

4) Prisma: generar cliente y aplicar migraciones
```powershell
npx prisma generate
npx prisma migrate dev --name init
```

5) Ejecutar en desarrollo
```powershell
pnpm dev
```
La app quedará disponible (por defecto) en http://localhost:3000.


## Uso de la aplicación
- Registro/Login: en `/login` (credenciales demo). Tras iniciar sesión, el cliente guarda `currentUser` y las llamadas al API envían `x-user-id`.
- Añadir prenda: en `/add-item` (se comprime la imagen antes de guardar). Campos: tipo (categoría), nombre, marca, estilo, color, imagen.
- Crear outfit: en `/create-outfit` selecciona categorías y prendas; la selección temporal se guarda en `sessionStorage`.
- Guardar outfit: en `/save-outfit` pon un nombre y guarda. Se persistirá en MySQL.
- Ver outfits: en `/outfits` puedes listar, ver detalle y eliminar (con comprobación de propiedad). En detalle, cada prenda muestra overlay con Tipo/Marca/Estilo/Color.
- Recomendaciones IA: en `/ai-recommendations` genera un outfit usando tus prendas y guárdalo si te gusta.


## Scripts disponibles
```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint ."
}
```
- Desarrollo: `pnpm dev`
- Producción local: `pnpm build` y `pnpm start`


## Notas y limitaciones
- Autenticación: el uso de `x-user-id` desde `localStorage` es para DEMO. No es seguro para producción. Recomendado: Auth.js (cookies HTTP-only) o similar.
- Imágenes en DB: útil para prototipos; para producción, conviene usar almacenamiento de objetos (S3/GCS/Cloudinary) y guardar URLs.
- Next.js 15: los parámetros dinámicos (`params`) son `Promise` en algunos casos; el código ya usa `React.use`/`await` donde aplica.


## Solución de problemas (FAQ)
- "Cannot find module '@prisma/client'":
  - Ejecuta `npx prisma generate` tras `pnpm install`.
- Error 401 al crear/leer prendas u outfits:
  - Inicia sesión primero en `/login` (necesario para que el API reciba `x-user-id`).
- No puedo conectar a MySQL:
  - Revisa `DATABASE_URL`. Si tu servidor usa autenticación `caching_sha2_password`, quizá debas cambiarla a `mysql_native_password` o actualizar el cliente MySQL.
- Imágenes muy grandes o errores al subir:
  - El alta comprime a JPEG (máx ~1024px). Si persiste, usa imágenes más pequeñas.


## Producción (resumen)
1. Configura `DATABASE_URL` en el entorno de despliegue.
2. Ejecuta migraciones (`prisma migrate deploy`).
3. `pnpm build` y `pnpm start` (o usa tu plataforma preferida).



