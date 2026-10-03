import { Router } from "express";
import {
  listarProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from "../controllers/productos.controller.js";

const router = Router();

// GET /api/productos
router.get("/", listarProductos);

// GET /api/productos/:id
router.get("/:id", obtenerProductoPorId);

// POST /api/productos
router.post("/", crearProducto);

// PUT /api/productos/:id
router.put("/:id", actualizarProducto);

// DELETE /api/productos/:id
router.delete("/:id", eliminarProducto);

export default router;
