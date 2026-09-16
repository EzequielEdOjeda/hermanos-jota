import { Router } from "express";
import { recibirMensajeContacto } from "../controllers/contacto.controller.js";

const router = Router();

// POST /api/contacto
router.post("/", recibirMensajeContacto);

export default router;
