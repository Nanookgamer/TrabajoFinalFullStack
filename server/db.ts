/**
 * Pool de conexión a PostgreSQL.
 * Usa la librería "pg" (node-postgres) — Copyright (c) 2010-2024 Brian Carlson.
 *
 * Si existe DATABASE_URL (entorno Render) se conecta con SSL.
 * Si no, usa las variables individuales DB_HOST/PORT/NAME/USER/PASSWORD del .env local.
 *
 * El SSL solo se activa cuando la URL no es localhost, lo que permite usar
 * tanto la URL interna como la externa de Render sin cambiar la configuración.
 */
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const dbUrl = process.env.DATABASE_URL;

// Render: usa DATABASE_URL con SSL
// Desarrollo local: usa las variables individuales del .env (Lo he dejado para poder 
// seguir trabajandolo en local más adelante)
const pool = dbUrl
  ? new Pool({
      connectionString: dbUrl,
      ssl: dbUrl.includes("localhost") ? false : { rejectUnauthorized: false },
    })
  : new Pool({
      host:     process.env.DB_HOST,
      port:     Number(process.env.DB_PORT) || 5432,
      database: process.env.DB_NAME,
      user:     process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

export default pool;
