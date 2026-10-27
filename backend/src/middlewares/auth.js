import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";
import { crearError } from "../utils/httpError.js";

export async function verificarToken(req, res, next) {
  try {
    const [esquema, token] = (req.headers.authorization ?? "").split(" ");

    if (esquema?.toLowerCase() !== "bearer" || !token) {
      throw crearError(401, "Falta el token de autenticación (Authorization: Bearer <token>)");
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });

    const usuario = await Usuario.findById(payload.id);
    if (!usuario) {
      throw crearError(401, "El usuario de este token ya no existe");
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    next(error);
  }
}

export function soloAdmin(req, res, next) {
  if (req.usuario?.rol !== "admin") {
    return next(crearError(403, "Acceso denegado: esta acción es solo para administradores"));
  }
  next();
}

/**
 * Deja pasar a rol "admin" o "editor". Lo usan las rutas de productos
 * (crear/editar/eliminar), pero NO las de usuarios ni configuración.
 */
export function soloAdminOEditor(req, res, next) {
  if (req.usuario?.rol !== "admin" && req.usuario?.rol !== "editor") {
    return next(
      crearError(403, "Acceso denegado: esta acción requiere rol administrador o editor"),
    );
  }
  next();
}