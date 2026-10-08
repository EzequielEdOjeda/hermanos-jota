import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs'
import Usuario from "../models/Usuario.js";
import { crearError } from "../utils/httpError.js";

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN = 6;
const PASSWORD_MAX_BYTES = 72; // bcrypt ignora todo lo que pase de 72 bytes

/**
 * Firma el JWT con { id, rol }. Vence según JWT_EXPIRES (por defecto 7 días).
 */
function firmarToken(usuario) {
  return jwt.sign({ id: usuario.id, rol: usuario.rol }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || "7d",
  });
}

/**
 * PUT /api/auth/me — actualiza el perfil del usuario logueado.
 * Body: { nombre?, passwordActual?, passwordNueva? }
 * - El nombre es opcional.
 * - Para cambiar la contraseña hay que enviar passwordActual + passwordNueva.
 */
export async function actualizarPerfil(req, res, next) {
  try {
    const { nombre, passwordActual, passwordNueva } = req.body ?? {}
    const usuario = await Usuario.findById(req.usuario._id)
    if (!usuario) {
      return res.status(404).json({ ok: false, error: 'Usuario no encontrado' })
    }

    // Cambio de nombre
    if (nombre !== undefined) {
      const limpio = String(nombre).trim()
      if (limpio.length < 3) {
        return res.status(400).json({ ok: false, error: 'El nombre debe tener al menos 3 caracteres' })
      }
      usuario.nombre = limpio
    }

    // Cambio de contraseña (requiere la actual)
    if (passwordNueva) {
      if (!passwordActual) {
        return res.status(400).json({ ok: false, error: 'Ingresá tu contraseña actual' })
      }
      if (String(passwordNueva).length < 6) {
        return res.status(400).json({ ok: false, error: 'La nueva contraseña debe tener al menos 6 caracteres' })
      }
      const coincide = await bcrypt.compare(passwordActual, usuario.password)
      if (!coincide) {
        return res.status(401).json({ ok: false, error: 'La contraseña actual no es correcta' })
      }
      usuario.password = await bcrypt.hash(passwordNueva, 10)
    }

    await usuario.save()

    // Devolvemos el usuario SIN la contraseña (mismo formato que /auth/me)
    res.json({
      ok: true,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Valida los datos de registro. Devuelve un array con los mensajes de error
 * (vacío si todo está bien).
 */
function validarRegistro({ nombre, email, password }) {
  const errores = [];

  if (typeof nombre !== "string" || nombre.trim().length < 2) {
    errores.push("El nombre debe tener al menos 2 caracteres");
  }

  if (typeof email !== "string" || !REGEX_EMAIL.test(email.trim())) {
    errores.push("El correo electrónico no es válido");
  }

  if (typeof password !== "string" || password.length < PASSWORD_MIN) {
    errores.push(`La contraseña debe tener al menos ${PASSWORD_MIN} caracteres`);
  } else if (Buffer.byteLength(password) > PASSWORD_MAX_BYTES) {
    errores.push(`La contraseña no puede superar los ${PASSWORD_MAX_BYTES} caracteres`);
  }

  return errores;
}

/**
 * POST /api/auth/register
 * Crea una cuenta nueva. El rol SIEMPRE es "cliente": si el body trae un
 * campo `rol` se ignora (la desestructuración de abajo no lo toma), así
 * nadie puede auto-asignarse el rol admin.
 */
export async function register(req, res, next) {
  try {
    const { nombre, email, password } = req.body ?? {};

    const errores = validarRegistro({ nombre, email, password });
    if (errores.length > 0) {
      throw crearError(400, errores.join(". "));
    }

    const emailNormalizado = email.trim().toLowerCase();

    if (await Usuario.exists({ email: emailNormalizado })) {
      throw crearError(409, "Ya existe una cuenta con ese correo electrónico");
    }

    // El hash bcrypt lo aplica el hook pre("save") del modelo.
    const usuario = await Usuario.create({ nombre, email: emailNormalizado, password });

    res.status(201).json({ ok: true, usuario, token: firmarToken(usuario) });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/login
 * Devuelve { usuario, token } si las credenciales son correctas.
 * El mensaje es el mismo si el correo no existe o la contraseña no
 * coincide, para no revelar qué correos están registrados.
 */
export async function login(req, res, next) {
  try {
    const { email, password } = req.body ?? {};

    // typeof evita que lleguen objetos tipo { "$ne": null } a la consulta.
    if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
      throw crearError(400, "Ingresá tu correo electrónico y tu contraseña");
    }

    const usuario = await Usuario.findOne({ email: email.trim().toLowerCase() }).select(
      "+password",
    );

    const coincide = usuario ? await usuario.compararPassword(password) : false;
    if (!coincide) {
      throw crearError(401, "Credenciales inválidas");
    }

    // toJSON del modelo elimina el password de la respuesta.
    res.json({ ok: true, usuario, token: firmarToken(usuario) });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/auth/me   (requiere verificarToken)
 * Devuelve el usuario dueño del token. El frontend lo usa al recargar la
 * página para validar que la sesión guardada siga siendo válida.
 */
export function me(req, res) {
  res.json({ ok: true, usuario: req.usuario });
}
