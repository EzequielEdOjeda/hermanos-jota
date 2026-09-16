import express from "express";
import cors from "cors";

import { logger } from "./middlewares/logger.js";
import { notFound } from "./middlewares/notFound.js";
import { errorHandler } from "./middlewares/errorHandler.js";

import productosRouter from "./routes/productos.routes.js";
import contactoRouter from "./routes/contacto.routes.js";

const app = express();

// --- Middlewares globales ---
app.use(cors()); // Habilita peticiones desde el cliente de React (otro origen/puerto)
app.use(express.json()); // Parsea body JSON en peticiones POST/PUT
app.use(logger); // Log de método + URL de cada request

// --- Ruta de salud, útil para verificar que el server está arriba ---
app.get("/api", (req, res) => {
  res.json({ ok: true, mensaje: "API de Hermanos Jota funcionando 🌳" });
});

// --- Rutas de la API, organizadas de forma modular ---
app.use("/api/productos", productosRouter);
app.use("/api/contacto", contactoRouter);

// --- Manejo de 404 y errores (siempre al final) ---
app.use(notFound);
app.use(errorHandler);

export default app;
