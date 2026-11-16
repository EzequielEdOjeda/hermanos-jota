import mongoose from "mongoose";

export const ESTADOS_PEDIDO = ["pendiente", "confirmado", "enviado", "entregado", "cancelado"];

// Cada ítem guarda una "foto" del producto al momento de comprar (nombre y precio),
// así el historial no cambia si después se edita o se elimina el producto.
const itemPedidoSchema = new mongoose.Schema(
  {
    producto: { type: mongoose.Schema.Types.ObjectId, ref: "Producto", required: true },
    nombre: { type: String, required: true, trim: true },
    precio: { type: Number, required: true, min: 0 },
    cantidad: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

const pedidoSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
      index: true,
    },
    items: {
      type: [itemPedidoSchema],
      validate: {
        validator: (items) => items.length > 0,
        message: "El pedido debe tener al menos un producto",
      },
    },
    total: { type: Number, required: true, min: 0 },
    estado: {
      type: String,
      enum: { values: ESTADOS_PEDIDO, message: "Estado inválido: {VALUE}" },
      default: "pendiente",
    },
  },
  { timestamps: true },
);

pedidoSchema.set("toJSON", {
  transform(_doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model("Pedido", pedidoSchema);