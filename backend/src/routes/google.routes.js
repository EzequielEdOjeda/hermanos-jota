import { Router } from "express";

import { loginConGoogle } from "../controllers/google.controller.js";

const router = Router();

// POST /api/auth/google (público: es una forma de iniciar sesión)
router.post("/", loginConGoogle);

export default router;