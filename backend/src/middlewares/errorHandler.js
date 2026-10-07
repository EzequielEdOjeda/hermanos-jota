/**
 * Manejador de errores centralizado.
 * Al tener 4 parámetros, Express lo reconoce automáticamente como
 * middleware de manejo de errores. Cualquier `next(error)` de la
 * aplicación termina acá.
 *
 * Además de los errores con `status` propio (ver utils/httpError.js),
 * traduce los errores típicos de Mongoose y JWT a respuestas HTTP:
 *
 *   ValidationError / CastError ....... 400
 *   JsonWebTokenError (token inválido
 *   o vencido) ........................ 401
 *   Clave duplicada (E11000) .......... 409
 */

const ERRORES_JWT = ["JsonWebTokenError", "TokenExpiredError", "NotBeforeError"];

export function errorHandler(err, req, res, next) {
  let status = err.status ?? 500;
  let mensaje = err.message || "Error interno del servidor";

  if (err.name === "ValidationError" && err.errors) {
    // Mongoose: junta los mensajes de cada campo inválido.
    status = 400;
    mensaje = Object.values(err.errors)
      .map((e) => (e.name === "CastError" ? `El valor de "${e.path}" no es válido` : e.message))
      .join(". ");
  } else if (err.name === "CastError") {
    status = 400;
    mensaje = `El valor de "${err.path}" no es válido`;
  } else if (ERRORES_JWT.includes(err.name)) {
    // Incluye TokenExpiredError, que hereda de JsonWebTokenError.
    status = 401;
    mensaje =
      err.name === "TokenExpiredError"
        ? "El token venció, iniciá sesión de nuevo"
        : "Token inválido";
  } else if (err.code === 11000) {
    // Índice único violado (email o slug repetido).
    status = 409;
    const campo = Object.keys(err.keyValue ?? {})[0];
    mensaje = campo
      ? `Ya existe un registro con ese valor de "${campo}"`
      : "Ya existe un registro con esos datos";
  } else if (err.type === "entity.parse.failed") {
    // express.json(): el body no es un JSON válido.
    status = 400;
    mensaje = "El cuerpo de la petición no es un JSON válido";
  }

  if (status >= 500) {
    console.error("💥 Error interno:", err);
    // En producción no se filtran detalles internos (hosts, queries, etc.).
    if (process.env.NODE_ENV === "production") {
      mensaje = "Error interno del servidor";
    }
  }

  res.status(status).json({
    ok: false,
    error: mensaje,
  });
}
