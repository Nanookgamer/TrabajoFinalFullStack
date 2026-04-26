/**
 * Pool de conexión a PostgreSQL.
 *
 * En producción (Render) se usa DATABASE_URL con SSL habilitado.
 * En desarrollo se usan las variables individuales DB_HOST, DB_PORT,
 * DB_NAME, DB_USER y DB_PASSWORD del archivo .env.
 *
 * El SSL se activa solo si la URL no apunta a localhost, lo que permite
 * usar tanto la URL interna como la externa de Render sin cambios de config.
 */
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const dbUrl = process.env.DATABASE_URL;

// Si existe DATABASE_URL se usa (Render); si no, se usan las variables individuales (local)
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
