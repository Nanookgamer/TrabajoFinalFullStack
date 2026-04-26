# Dice Tactics

Juego de combate por turnos con cartas y dados. El jugador avanza por 4 pisos derrotando enemigos, comprando cartas en la tienda y resolviendo eventos aleatorios hasta llegar al jefe final.

## Stack

- **Frontend**: React 19 + TypeScript (Vite)
- **Backend**: Node.js + Express 5 + TypeScript
- **Base de datos**: PostgreSQL
- **Auth**: JWT + bcrypt
- **Despliegue**: Render

## Estructura

```
src/        → Frontend React (páginas, componentes, datos)
server/     → Backend Express (rutas, middleware, BD)
public/img/ → Imágenes del juego (jugador, enemigos, jefes, tienda)
```

## Desarrollo local

### Requisitos
- Node.js 18+
- PostgreSQL en local

### Configuración

Copia `.env.example` a `.env` y rellena los valores:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nombre_de_tu_bd
DB_USER=postgres
DB_PASSWORD=tu_password
JWT_SECRET=una_cadena_secreta_larga
```

### Arrancar

```bash
npm install

# Terminal 1 — servidor Express (puerto 3001)
npm run dev:server

# Terminal 2 — frontend Vite (puerto 5173)
npm run dev
```

Abre **http://localhost:5173**

Las tablas de la base de datos se crean automáticamente al arrancar el servidor.

## Producción

```bash
npm run build   # compila frontend (dist/client/) y servidor (dist/server/)
npm start       # arranca el servidor, que también sirve el frontend
```

## Despliegue en Render

1. Sube el repositorio a GitHub
2. En Render → **New Web Service** → conecta el repo
3. Crea una base de datos PostgreSQL en Render y copia la **External Database URL**
4. En el web service añade las variables de entorno:
   - `DATABASE_URL` → URL copiada del paso anterior
   - `JWT_SECRET` → cadena secreta larga
   - `NODE_ENV` → `production`
5. Render ejecuta `npm install && npm run build` y luego `npm start`

## Comandos disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Frontend Vite en localhost:5173 |
| `npm run dev:server` | Servidor Express con hot-reload |
| `npm run build` | Build completo (cliente + servidor) |
| `npm start` | Arrancar servidor en producción |
| `npm run lint` | ESLint |
