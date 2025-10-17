# Stylo — Gestor de armario y outfits

Aplicación web para gestionar tu armario, crear y guardar outfits, obtener recomendaciones con IA y visualizar prendas con una superposición AR sencilla.


## Tecnologías clave
- Framework: Next.js 15 (App Router) + TypeScript
- UI: Tailwind CSS 4 + shadcn/ui (Radix)
- Estado/cliente: React 19
- Back-end/API: Rutas del App Router (route handlers)
- Base de datos: MySQL 8 con Prisma ORM
- Autenticación (demo): email/contraseña (hash con bcrypt). El cliente mantiene `{ id, email, name }` en `localStorage` y las peticiones al API envían `x-user-id`. Nota: esto es solo para demo; para producción se recomienda Auth.js (cookies/JWT) u otro sistema seguro.
- Imágenes: almacenadas como Data URL (base64) en DB (campo `LongText`). En el alta se comprimen en el cliente.


## Estructura del proyecto (resumen)
- `app/` — Páginas (App Router) y API routes
  - `add-item/` — Alta de prendas
  - `create-outfit/` — Flujo para crear outfit
  - `save-outfit/` — Guardar outfit (desde selección o IA)
  - `outfits/` — Listado y detalle de outfits guardados
  - `ai-recommendations/` — Recomendaciones con IA (usa tus prendas)
  - `api/` — Rutas API (`auth`, `items`, `outfits`, `recommend-outfit`)
- `components/` — Componentes UI (incluye `category-grid` con hover de detalles)
- `lib/` — Utilidades (Prisma client, tipos, almacenamiento cliente/servidor)
- `prisma/` — Esquema de Prisma y migraciones


## Requisitos previos
- Node.js >= 18.17 (recomendado 20+)
- PNPM (o instala con `npm i -g pnpm`)
- MySQL 8 (local, Docker o gestionado)


## Configuración
1) Clonar e instalar dependencias
```powershell
pnpm install
```

2) Variables de entorno
- Copia `.env.example` a `.env` y completa tu cadena de conexión:
```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
```
Ejemplos locales:
- Sin contraseña (según tu MySQL): `mysql://root@localhost:3306/stylo`
- Con contraseña: `mysql://root:mi_password@localhost:3306/stylo`

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


## Próximos pasos recomendados
- Integrar Auth.js para sesiones seguras (cookies/JWT) y eliminar el uso de `x-user-id` del cliente.
- Mover imágenes a un storage externo y servirlas optimizadas.
- Añadir tests de unidad e integración para rutas API.
