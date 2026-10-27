import express from "express";
import cors from "cors";

import { logger } from "./middlewares/logger.js";
import { notFound } from "./middlewares/notFound.js";
import { errorHandler } from "./middlewares/errorHandler.js";

import authRouter from "./routes/auth.routes.js";
import productosRouter from "./routes/productos.routes.js";
import contactoRouter from "./routes/contacto.routes.js";
import usuarioRouter from "./routes/usuario.routes.js";
import configuracionRouter from "./routes/configuracion.js";

const app = express();

// --- Middlewares globales ---
app.use(cors());
app.use(express.json());
app.use(logger);

// --- Ruta de salud ---
app.get("/api", (req, res) => {
  res.json({ ok: true, mensaje: "API de Hermanos Jota funcionando 🌳" });
});

// --- Rutas de la API ---
app.use("/api/auth", authRouter);
app.use("/api/productos", productosRouter);
app.use("/api/contacto", contactoRouter);
app.use("/api/usuarios", usuarioRouter);
app.use("/api/configuracion", configuracionRouter);

// --- 404 + errores (siempre al final) ---
app.use(notFound);
app.use(errorHandler);

export default app;