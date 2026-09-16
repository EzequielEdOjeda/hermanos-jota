/**
 * Middleware de 404.
 * Se ejecuta cuando ninguna ruta anterior coincidió con la petición.
 * Construye un error con status 404 y lo pasa al manejador centralizado.
 */
export function notFound(req, res, next) {
  const error = new Error(`Ruta no encontrada: ${req.method} ${req.originalUrl}`);
  error.status = 404;
  next(error);
}
