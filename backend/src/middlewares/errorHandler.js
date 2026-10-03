/**
 * Manejador de errores centralizado.
 * Al tener 4 parámetros, Express lo reconoce automáticamente como
 * middleware de manejo de errores. Cualquier `next(error)` de la
 * aplicación termina acá.
 *
 * Además de los errores "manuales" (`error.status` seteado a mano en
 * los controladores), también traduce los errores típicos que tira
 * Mongoose para que el cliente siempre reciba un JSON prolijo y un
 * status code correcto, en vez de un 500 genérico:
 *
 *  - ValidationError → 400, con un mapa de errores por campo.
 *  - CastError        → 400, cuando un id no tiene el formato esperado.
 *  - código 11000     → 409, clave duplicada (índice único).
 */
export function errorHandler(err, req, res, next) {
  // Errores de validación del esquema de Mongoose (create / findByIdAndUpdate)
  if (err.name === "ValidationError") {
    const errores = {};
    for (const campo in err.errors) {
      errores[campo] = err.errors[campo].message;
    }

    return res.status(400).json({
      ok: false,
      error: "Revisá los datos del producto",
      errores,
    });
  }

  // Id con formato inválido para Mongo (por ejemplo, no tiene 24 caracteres hex)
  if (err.name === "CastError") {
    return res.status(400).json({
      ok: false,
      error: `"${err.value}" no es un id válido`,
    });
  }

  // Clave duplicada (si en el futuro se agrega un índice `unique`)
  if (err.code === 11000) {
    return res.status(409).json({
      ok: false,
      error: "Ya existe un registro con ese valor único",
    });
  }

  const status = err.status ?? 500;

  if (status >= 500) {
    console.error("💥 Error interno:", err);
  }

  res.status(status).json({
    ok: false,
    error: err.message || "Error interno del servidor",
  });
}
