import Usuario from '../models/Usuario.js'
import { crearError } from '../utils/httpError.js' 

/** GET /api/usuarios — solo admin. Devuelve todos los usuarios sin el hash. */
export async function listarUsuarios(req, res, next) {
  try {
    const usuarios = await Usuario.find().select('-password').sort({ createdAt: -1 })
    res.json({ ok: true, data: usuarios })
  } catch (error) {
    next(error)
  }
}

/**
 * PATCH /api/usuarios/:id/rol — solo admin.
 * Body: { rol: 'admin' | 'editor' | 'cliente' }
 * Un admin no puede quitarse a sí mismo el rol (evita quedarse sin admins).
 */
export async function cambiarRol(req, res, next) {
  try {
    const { rol } = req.body ?? {}
    
    if (!['admin', 'editor', 'cliente'].includes(rol)) {
      return res.status(400).json({ ok: false, error: 'Rol inválido' })
    }

    if (String(req.usuario._id) === String(req.params.id) && rol !== 'admin') {
      return res.status(400).json({
        ok: false,
        error: 'No podés quitarte tu propio rol de admin',
      })
    }

    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      { rol },
      { new: true, runValidators: true },
    ).select('-password')

    if (!usuario) {
      return res.status(404).json({ ok: false, error: 'Usuario no encontrado' })
    }

    res.json({ ok: true, data: usuario })
  } catch (error) {
    next(error)
  }
}

export async function eliminarUsuario(req, res, next) {
  try {
    const { id } = req.params;
    if (req.usuario.id === id) throw crearError(400, "No podés eliminarte a vos mismo");
    const usuario = await Usuario.findByIdAndDelete(id);
    if (!usuario) throw crearError(404, "Usuario no encontrado");
    res.json({ ok: true, data: usuario });
  } catch (error) {
    next(error);
  }
}