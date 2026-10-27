import { Router } from "express";
import { verificarToken, soloAdmin } from "../middlewares/auth.js";
import {
  actualizarConfiguracion,
  obtenerConfiguracion,
  obtenerConfiguracionPublica,
} from "../controllers/configuracion.js";

const router = Router();

// Público: lo consume el carrito para armar el link de WhatsApp.
router.get("/publica", obtenerConfiguracionPublica);

// Solo admin: configuración de pagos.
router.get("/", verificarToken, soloAdmin, obtenerConfiguracion);
router.put("/", verificarToken, soloAdmin, actualizarConfiguracion);

export default router;