const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * POST /api/contacto
 * Recibe el formulario de contacto (nombre, email, mensaje), lo valida
 * en el servidor y responde con un mensaje de éxito. No persiste los
 * datos en una base de datos: el objetivo de este endpoint es demostrar
 * el uso de express.json() y el ciclo completo de una petición POST.
 */
export function recibirMensajeContacto(req, res, next) {
  try {
    const { nombre = "", email = "", mensaje = "" } = req.body ?? {};

    const errores = {};

    if (nombre.trim().length < 3) {
      errores.nombre = "El nombre debe tener al menos 3 caracteres";
    }

    if (!REGEX_EMAIL.test(email.trim())) {
      errores.email = "El correo electrónico no es válido";
    }

    if (mensaje.trim().length < 10) {
      errores.mensaje = "El mensaje debe tener al menos 10 caracteres";
    }

    if (Object.keys(errores).length > 0) {
      return res.status(400).json({
        ok: false,
        mensaje: "Revisá los datos del formulario",
        errores,
      });
    }

    console.log(`📩 Nuevo mensaje de contacto de ${nombre} <${email}>`);

    res.status(201).json({
      ok: true,
      mensaje: "¡Gracias! Tu mensaje fue recibido correctamente.",
    });
  } catch (error) {
    next(error);
  }
}
