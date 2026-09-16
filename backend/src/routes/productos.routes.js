import { Router } from "express";
import { listarProductos, obtenerProductoPorId } from "../controllers/productos.controller.js";

const router = Router();

// GET /api/productos
router.get("/", listarProductos);

// GET /api/productos/:id
router.get("/:id", obtenerProductoPorId);

export default router;
