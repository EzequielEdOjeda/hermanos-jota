import Configuracion from "../models/Configuracion.js";
import { crearError } from "../utils/httpError.js";

const NUMERO_POR_DEFECTO = "5493624031997";
const MENSAJE_POR_DEFECTO = "Hola Hermanos Jota, quiero pagar:";

/** GET /api/configuracion — solo admin. */
export async function obtenerConfiguracion(req, res, next) {
  try {
    let cfg = await Configuracion.findOne({ clave: "global" });
    if (!cfg) {
      cfg = await Configuracion.create({
        clave: "global",
        whatsappNumero: NUMERO_POR_DEFECTO,
        whatsappMensajeBase: MENSAJE_POR_DEFECTO,
      });
    }
    res.json({ ok: true, data: cfg });
  } catch (error) {
    next(error);
  }
}

/** PUT /api/configuracion — solo admin. */
export async function actualizarConfiguracion(req, res, next) {
  try {
    const { whatsappNumero, whatsappMensajeBase } = req.body;

    if (whatsappNumero !== undefined && !/^\d{8,15}$/.test(whatsappNumero)) {
      throw crearError(
        400,
        "El número de WhatsApp debe contener solo dígitos (entre 8 y 15).",
      );
    }

    if (
      whatsappMensajeBase !== undefined &&
      typeof whatsappMensajeBase !== "string"
    ) {
      throw crearError(400, "El mensaje base debe ser un texto.");
    }

    const cfg = await Configuracion.findOneAndUpdate(
      { clave: "global" },
      {
        ...(whatsappNumero !== undefined && { whatsappNumero }),
        ...(whatsappMensajeBase !== undefined && { whatsappMensajeBase }),
      },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    res.json({ ok: true, data: cfg });
  } catch (error) {
    next(error);
  }
}

/** GET /api/configuracion/publica — público, solo campos necesarios para el carrito. */
export async function obtenerConfiguracionPublica(req, res, next) {
  try {
    const cfg = await Configuracion.findOne({ clave: "global" });
    res.json({
      ok: true,
      data: {
        whatsappNumero: cfg?.whatsappNumero || NUMERO_POR_DEFECTO,
        whatsappMensajeBase: cfg?.whatsappMensajeBase || MENSAJE_POR_DEFECTO,
      },
    });
  } catch (error) {
    next(error);
  }
}