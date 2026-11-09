import { Router } from "express";

import { crearPedido, listarMisPedidos } from "../controllers/pedidos.controller.js";
import { verificarToken } from "../middlewares/auth.js";

const router = Router();

// Todas las rutas de pedidos requieren sesión: primero se autentica (401).

// POST /api/pedidos
router.post("/", verificarToken, crearPedido);

// GET /api/pedidos/mis-pedidos
router.get("/mis-pedidos", verificarToken, listarMisPedidos);

export default router;