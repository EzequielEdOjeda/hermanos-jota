import mongoose from "mongoose";

// Mismas categorías que usa el filtro del catálogo en el frontend.
export const CATEGORIAS = ["living", "comedor", "dormitorio", "oficina"];

const texto = { type: String, default: "", trim: true };

const productoSchema = new mongoose.Schema(
  {
    // --- Campos base del sprint ---
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
    },
    descripcion: texto,
    precio: {
      type: Number,
      required: [true, "El precio es obligatorio"],
      min: [0, "El precio no puede ser negativo"],
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, "El stock no puede ser negativo"],
      validate: {
        validator: Number.isInteger,
        message: "El stock debe ser un número entero",
      },
    },
    imagenUrl: texto,
    creadoPor: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },

    // --- Campos del catálogo que el frontend ya usa ---
    slug: { type: String, trim: true, lowercase: true, unique: true },
    categoria: {
      type: String,
      enum: { values: CATEGORIAS, message: "Categoría inválida: {VALUE}" },
      lowercase: true,
      trim: true,
      default: "living",
    },
    descripcionCorta: texto, // texto breve para las tarjetas y el buscador
    medidas: texto,
    materiales: texto,
    acabado: texto,
    peso: texto,
    detalleExtra: texto,
    destacado: { type: Boolean, default: false },
  },
  { timestamps: true },
);

function slugify(valor) {
  return valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quita tildes
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Completa datos derivados para que POST /api/productos funcione con el
 * mínimo { nombre, precio }:
 *  - slug: se genera a partir del nombre si no viene.
 *  - descripcionCorta: se recorta de `descripcion` si quedó vacía.
 */
productoSchema.pre("validate", function () {
  if (!this.slug && this.nombre) {
    const slug = slugify(this.nombre);
    if (slug) this.slug = slug;
  }

  if (!this.descripcionCorta && this.descripcion) {
    this.descripcionCorta =
      this.descripcion.length > 120
        ? `${this.descripcion.slice(0, 117).trimEnd()}…`
        : this.descripcion;
  }
});

// _id → id; se eliminan __v y password de cualquier respuesta JSON.
productoSchema.set("toJSON", {
  transform(_doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    delete ret.password;
    return ret;
  },
});

export default mongoose.model("Producto", productoSchema);
