/**
 * Middleware de logging.
 * Registra en consola el método HTTP, la URL solicitada y la fecha/hora
 * de cada petición que llega al servidor.
 */
export function logger(req, res, next) {
  const fecha = new Date().toISOString();
  console.log(`[${fecha}] ${req.method} ${req.originalUrl}`);
  next();
}
