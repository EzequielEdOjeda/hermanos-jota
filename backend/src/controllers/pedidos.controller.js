import mongoose from "mongoose";

import Pedido from "../models/Pedido.js";
import Producto from "../models/Producto.js";
import { crearError } from "../utils/httpError.js";

/**
 * POST /api/pedidos  (requiere token)
 * Body: { items: [{ producto: "<id>", cantidad: 2 }, ...] }
 *
 * El cliente solo manda ids y cantidades. Nombre, precio y total se calculan
 * acá con los datos de la base, para que nadie pueda alterar el precio desde
 * el navegador.
 */
export async function crearPedido(req, res, next) {
  try {
    const { items } = req.body ?? {};

    if (!Array.isArray(items) || items.length === 0) {
      throw crearError(400, "El pedido debe tener al menos un producto");
    }

    // Unifica productos repetidos sumando sus cantidades.
    const cantidades = new Map();
    for (const item of items) {
      const id = String(item?.producto ?? "");
      const cantidad = Number(item?.cantidad);

      if (!mongoose.isValidObjectId(id)) {
        throw crearError(400, "Hay un producto inválido en el pedido");
      }
      if (!Number.isInteger(cantidad) || cantidad < 1) {
        throw crearError(400, "La cantidad de cada producto debe ser un número entero de 1 o más");
      }
      cantidades.set(id, (cantidades.get(id) ?? 0) + cantidad);
    }

    const productos = await Producto.find({ _id: { $in: [...cantidades.keys()] } });
    if (productos.length !== cantidades.size) {
      throw crearError(400, "Alguno de los productos del pedido ya no existe");
    }

    const itemsPedido = productos.map((producto) => {
      const cantidad = cantidades.get(producto._id.toString());

      if (typeof producto.stock === "number" && cantidad > producto.stock) {
        throw crearError(
          409,
          `No hay stock suficiente de "${producto.nombre}" (disponible: ${producto.stock})`,
        );
      }

      return {
        producto: producto._id,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad,
      };
    });

    const total = itemsPedido.reduce((suma, item) => suma + item.precio * item.cantidad, 0);

    const pedido = await Pedido.create({
      usuario: req.usuario._id,
      items: itemsPedido,
      total,
    });

    res.status(201).json(pedido);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/pedidos/mis-pedidos  (requiere token)
 * Devuelve solo los pedidos del usuario logueado, del más nuevo al más viejo.
 */
export async function listarMisPedidos(req, res, next) {
  try {
    const pedidos = await Pedido.find({ usuario: req.usuario._id }).sort({ createdAt: -1 });
    res.json(pedidos);
  } catch (error) {
    next(error);
  }
}