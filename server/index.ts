import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import authRoutes from "./routes/auth.js";
import saveRoutes from "./routes/save.js";
import { migrate } from "./migrate.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app  = express();
const PORT = Number(process.env.PORT) || 3001;

// En desarrollo Vite corre en otro puerto, en producción todo es mismo origen
if (process.env.NODE_ENV !== "production") {
  app.use(cors({ origin: "http://localhost:5173" }));
}

app.use(express.json());

// ── API ───────────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/save", saveRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", env: process.env.NODE_ENV ?? "development" });
});

// ── Frontend estático (producción) ────────────────────────────────────────────
// Vite construye en dist/client/; el servidor compilado queda en dist/server/
const clientDist = path.join(__dirname, "..", "client");
app.use(express.static(clientDist));
app.get("/{*splat}", (_req, res) => {
  res.sendFile(path.join(clientDist, "index.html"));
});

// ── Arranque ──────────────────────────────────────────────────────────────────
await migrate();
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
