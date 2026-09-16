import productos from "../data/productos.js";

/**
 * GET /api/productos
 * Devuelve el listado completo de productos.
 */
export function listarProductos(req, res) {
  res.json(productos);
}

/**
 * GET /api/productos/:id
 * Busca un producto por id. Si no existe, delega en el
 * middleware de manejo de errores mediante next(error).
 */
export function obtenerProductoPorId(req, res, next) {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    const error = new Error("El id del producto debe ser numérico");
    error.status = 400;
    return next(error);
  }

  const producto = productos.find((p) => p.id === id);

  if (!producto) {
    const error = new Error(`No se encontró el producto con id ${id}`);
    error.status = 404;
    return next(error);
  }

  res.json(producto);
}
