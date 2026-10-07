/**
 * Crea un Error con un `status` HTTP. Al lanzarlo (o pasarlo a `next`),
 * el errorHandler centralizado lo convierte en { ok: false, error }.
 */
export function crearError(status, mensaje) {
  const error = new Error(mensaje);
  error.status = status;
  return error;
}
