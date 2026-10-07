import jwt from "jsonwebtoken";
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
