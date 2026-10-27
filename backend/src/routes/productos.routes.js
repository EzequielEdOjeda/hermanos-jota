import { Router } from "express";
import {
  actualizarProducto,
  crearProducto,
  eliminarProducto,
  listarProductos,
  obtenerProductoPorId,
} from "../controllers/productos.controller.js";
import { soloAdminOEditor, verificarToken } from "../middlewares/auth.js";
import { validarObjectId } from "../middlewares/validarObjectId.js";

const router = Router();

// --- Lectura: pública ---

// GET /api/productos
router.get("/", listarProductos);

// GET /api/productos/:id
router.get("/:id", validarObjectId("id"), obtenerProductoPorId);

// --- Escritura: admin o editor ---
// El orden importa: primero se autentica (401), después se valida el rol (403)
// y recién entonces se mira el id (400).

// POST /api/productos
router.post("/", verificarToken, soloAdminOEditor, crearProducto);

// PUT /api/productos/:id
router.put("/:id", verificarToken, soloAdminOEditor, validarObjectId("id"), actualizarProducto);

// DELETE /api/productos/:id
router.delete("/:id", verificarToken, soloAdminOEditor, validarObjectId("id"), eliminarProducto);

export default router;