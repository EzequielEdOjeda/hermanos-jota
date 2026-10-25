import mongoose from "mongoose";
import Product from "../models/Product.js";

/**
 * GET /api/productos
 * Devuelve el listado completo de productos, los más nuevos primero.
 */
export async function listarProductos(req, res, next) {
  try {
    const productos = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(productos);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/productos/:id
 * Busca un producto por su _id de MongoDB. Si el id no tiene un formato
 * válido o no existe ningún producto con ese id, responde 404 (en vez de
 * dejar que Mongoose tire un CastError de 500).
 */
export async function obtenerProductoPorId(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      const error = new Error(`"${id}" no es un id de producto válido`);
      error.status = 404;
      return next(error);
    }

    const producto = await Product.findById(id);

    if (!producto) {
      const error = new Error(`No se encontró un producto con id ${id}`);
      error.status = 404;
      return next(error);
    }

    res.status(200).json(producto);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/productos
 * Crea un producto nuevo. La validación (nombre y precio requeridos,
 * precio/stock no negativos, categoría dentro del enum) la hace el
 * esquema de Mongoose; cualquier ValidationError la formatea el
 * errorHandler centralizado como una respuesta 400 prolija.
 */
export async function crearProducto(req, res, next) {
  try {
    const { nombre, descripcion, precio, stock, imagenUrl, categoria, destacado } = req.body;

    const producto = await Product.create({
      nombre,
      descripcion,
      precio,
      stock,
      imagenUrl,
      categoria,
      destacado,
    });

    res.status(201).json(producto);
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/productos/:id
 * Actualiza un producto existente. `runValidators: true` hace que
 * Mongoose vuelva a correr las validaciones del esquema también en el
 * update (por defecto solo corren en `create`/`save`).
 */
export async function actualizarProducto(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      const error = new Error(`"${id}" no es un id de producto válido`);
      error.status = 404;
      return next(error);
    }

    const { nombre, descripcion, precio, stock, imagenUrl, categoria, destacado } = req.body;

    const producto = await Product.findByIdAndUpdate(
      id,
      { nombre, descripcion, precio, stock, imagenUrl, categoria, destacado },
      { new: true, runValidators: true, context: "query" },
    );

    if (!producto) {
      const error = new Error(`No se encontró un producto con id ${id}`);
      error.status = 404;
      return next(error);
    }

    res.status(200).json(producto);
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/productos/:id
 * Elimina un producto. Devuelve el documento eliminado para que el
 * cliente pueda, por ejemplo, mostrar un mensaje de confirmación con
 * su nombre.
 */
export async function eliminarProducto(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      const error = new Error(`"${id}" no es un id de producto válido`);
      error.status = 404;
      return next(error);
    }

    const producto = await Product.findByIdAndDelete(id);

    if (!producto) {
      const error = new Error(`No se encontró un producto con id ${id}`);
      error.status = 404;
      return next(error);
    }

    res.status(200).json({
      ok: true,
      mensaje: `"${producto.nombre}" fue eliminado correctamente`,
      producto,
    });
  } catch (error) {
    next(error);
  }
}
