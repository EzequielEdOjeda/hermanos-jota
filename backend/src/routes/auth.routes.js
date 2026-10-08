import { Router } from "express";
import { login, me, register, actualizarPerfil, } from "../controllers/auth.controller.js";
import { verificarToken } from "../middlewares/auth.js";

const router = Router();

// POST /api/auth/register  { nombre, email, password } → 201 { usuario, token }
router.post("/register", register);

// POST /api/auth/login  { email, password } → 200 { usuario, token }
router.post("/login", login);

// GET /api/auth/me  (Authorization: Bearer <token>) → 200 { usuario }
router.get("/me", verificarToken, me);

router.put('/me', verificarToken, actualizarPerfil) 

export default router;
