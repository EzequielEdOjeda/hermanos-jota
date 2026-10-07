import Producto from "../models/Producto.js";
import { crearError } from "../utils/httpError.js";

// Solo estos campos se aceptan desde el body. Así nadie puede forzar
// `creadoPor`, `_id`, `createdAt`, etc. enviándolos en la petición.
const CAMPOS_EDITABLES = [
  "nombre",
  "descripcion",
  "descripcionCorta",
  "precio",
  "stock",
  "imagenUrl",
  "slug",
  "categoria",
  "medidas",
  "materiales",
  "acabado",
  "peso",
  "detalleExtra",
  "destacado",
];

function extraerCampos(body) {
  const origen = body && typeof body === "object" ? body : {};
  return Object.fromEntries(
    CAMPOS_EDITABLES.filter((campo) => origen[campo] !== undefined).map((campo) => [
      campo,
      origen[campo],
    ]),
  );
}

/**
 * GET /api/productos   (público)
 * Devuelve el listado completo, en el orden en que fueron creados.
 */
export async function listarProductos(req, res, next) {
  try {
    const productos = await Producto.find().sort({ createdAt: 1, _id: 1 });
    res.json({ ok: true, data: productos });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/productos/:id   (público)
 * El id ya llega validado por el middleware validarObjectId.
 */
export async function obtenerProductoPorId(req, res, next) {
  try {
    const producto = await Producto.findById(req.params.id);

    if (!producto) {
      throw crearError(404, `No se encontró el producto con id ${req.params.id}`);
    }

    res.json({ ok: true, data: producto });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/productos   (verificarToken + soloAdmin)
 * Crea un producto y guarda quién lo creó en `creadoPor`.
 */
export async function crearProducto(req, res, next) {
  try {
    const producto = await Producto.create({
      ...extraerCampos(req.body),
      creadoPor: req.usuario.id,
    });

    res.status(201).json({ ok: true, data: producto });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/productos/:id   (verificarToken + soloAdmin)
 * Actualiza solo los campos enviados; el resto queda como estaba.
 * Se usa find + set + save (y no findByIdAndUpdate) para que corran los
 * validadores y los hooks del modelo.
 */
export async function actualizarProducto(req, res, next) {
  try {
    const campos = extraerCampos(req.body);

    if (Object.keys(campos).length === 0) {
      throw crearError(400, "No se envió ningún campo para actualizar");
    }

    const producto = await Producto.findById(req.params.id);

    if (!producto) {
      throw crearError(404, `No se encontró el producto con id ${req.params.id}`);
    }

    producto.set(campos);
    await producto.save();

    res.json({ ok: true, data: producto });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/productos/:id   (verificarToken + soloAdmin)
 */
export async function eliminarProducto(req, res, next) {
  try {
    const producto = await Producto.findByIdAndDelete(req.params.id);

    if (!producto) {
      throw crearError(404, `No se encontró el producto con id ${req.params.id}`);
    }

    res.json({ ok: true, mensaje: "Producto eliminado", data: producto });
  } catch (error) {
    next(error);
  }
}
