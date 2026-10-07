import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";
import { crearError } from "../utils/httpError.js";

/**
 * Exige un JWT válido en el header `Authorization: Bearer <token>`.
 *
 * - Sin header o con formato incorrecto → 401.
 * - Token inválido o vencido → jwt.verify lanza JsonWebTokenError /
 *   TokenExpiredError y el errorHandler lo traduce a 401.
 * - Adjunta el usuario en `req.usuario` (con id, nombre, email y rol).
 *
 * El usuario se vuelve a leer de la base en cada request: así, si un admin
 * es degradado o eliminado, su token deja de servir de inmediato en lugar de
 * seguir valiendo hasta que venza.
 */
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

/**
 * Debe usarse DESPUÉS de verificarToken. Deja pasar solo a rol "admin".
 */
export function soloAdmin(req, res, next) {
  if (req.usuario?.rol !== "admin") {
    return next(crearError(403, "Acceso denegado: esta acción es solo para administradores"));
  }
  next();
}
