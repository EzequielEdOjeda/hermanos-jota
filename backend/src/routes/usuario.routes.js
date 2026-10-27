import { Router } from "express";
import { listarUsuarios, cambiarRol, eliminarUsuario } from "../controllers/usuario.controller.js";
import { verificarToken, soloAdmin } from "../middlewares/auth.js";

const router = Router();

router.get("/", verificarToken, soloAdmin, listarUsuarios);
router.patch("/:id/rol", verificarToken, soloAdmin, cambiarRol);
router.delete("/:id", verificarToken, soloAdmin, eliminarUsuario);

export default router;