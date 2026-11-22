import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

import Usuario from "../models/Usuario.js";
import { crearError } from "../utils/httpError.js";

/**
 * POST /api/auth/google
 * Body: { credential }  → el ID token (JWT) que entrega el botón de Google en el front.
 *
 * 1. Verifica con Google que el token es auténtico, no venció y fue emitido
 *    para NUESTRA aplicación (audience = GOOGLE_CLIENT_ID).
 * 2. Busca el usuario por googleId o por email; si no existe lo crea (rol cliente).
 * 3. Responde igual que /auth/login: { ok, usuario, token } con NUESTRO JWT.
 */
export async function loginConGoogle(req, res, next) {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) throw crearError(500, "El inicio de sesión con Google no está configurado");

    const { credential } = req.body ?? {};
    if (typeof credential !== "string" || !credential) {
      throw crearError(400, "Falta el token de Google");
    }

    let payload;
    try {
      const cliente = new OAuth2Client(clientId);
      const ticket = await cliente.verifyIdToken({ idToken: credential, audience: clientId });
      payload = ticket.getPayload();
    } catch {
      throw crearError(401, "No pudimos verificar tu cuenta de Google");
    }

    if (!payload?.email || !payload.email_verified) {
      throw crearError(401, "Tu cuenta de Google no tiene un correo verificado");
    }

    const email = payload.email.toLowerCase();
    let usuario = await Usuario.findOne({ $or: [{ googleId: payload.sub }, { email }] });

    if (!usuario) {
      usuario = await Usuario.create({
        nombre: payload.name || email.split("@")[0],
        email,
        googleId: payload.sub,
      });
    } else if (!usuario.googleId) {
      // Ya tenía cuenta con contraseña: se vincula (Google verificó que el correo es suyo).
      usuario.googleId = payload.sub;
      await usuario.save();
    }

    const token = jwt.sign({ id: usuario._id, rol: usuario.rol }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES || "7d",
    });

    res.json({ ok: true, usuario, token });
  } catch (error) {
    next(error);
  }
}