import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const dbUrl = process.env.DATABASE_URL;

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
