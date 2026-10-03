import mongoose from "mongoose";

/**
 * Esquema de producto para "Mueblería Jota".
 *
 * Campos pedidos por la consigna: nombre, descripcion, precio, stock,
 * imagenUrl. Se suman dos campos opcionales, `categoria` y `destacado`,
 * para conservar el filtro por ambiente y la sección de destacados de
 * la home que ya existían en el sprint anterior (ver README → Decisiones
 * tomadas). Ninguno de los dos reemplaza ni condiciona a los campos
 * requeridos: ambos tienen un valor por defecto y son opcionales.
 */
const CATEGORIAS_VALIDAS = ["living", "comedor", "dormitorio", "oficina"];

const productSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre del producto es obligatorio"],
      trim: true,
      minlength: [2, "El nombre debe tener al menos 2 caracteres"],
    },
    descripcion: {
      type: String,
      trim: true,
      default: "",
    },
    precio: {
      type: Number,
      required: [true, "El precio del producto es obligatorio"],
      min: [0, "El precio no puede ser negativo"],
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, "El stock no puede ser negativo"],
    },
    imagenUrl: {
      type: String,
      trim: true,
      default: "",
    },
    categoria: {
      type: String,
      enum: {
        values: CATEGORIAS_VALIDAS,
        message: "La categoría debe ser una de: " + CATEGORIAS_VALIDAS.join(", "),
      },
      default: "living",
    },
    destacado: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // createdAt / updatedAt automáticos
  },
);

const Product = mongoose.model("Product", productSchema);

export default Product;
