/**
 * Manejador de errores centralizado.
 * Al tener 4 parámetros, Express lo reconoce automáticamente como
 * middleware de manejo de errores. Cualquier `next(error)` de la
 * aplicación termina acá.
 */

export function errorHandler(err, req, res, next) {
  const status = err.status ?? 500;

  if (status >= 500) {
    console.error("💥 Error interno:", err);
  }

  res.status(status).json({
    ok: false,
    error: err.message || "Error interno del servidor",
  });
}
