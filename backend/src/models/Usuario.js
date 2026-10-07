import bcrypt from "bcryptjs";
import mongoose from "mongoose";

export const ROLES = ["admin", "cliente"];
export const SALT_ROUNDS = 10;

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const usuarioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "El correo electrónico es obligatorio"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [REGEX_EMAIL, "El correo electrónico no es válido"],
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
      minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
      select: false, // nunca viaja en las consultas, salvo con .select("+password")
    },
    rol: {
      type: String,
      enum: { values: ROLES, message: "Rol inválido: {VALUE}" },
      default: "cliente",
    },
  },
  { timestamps: true },
);

/**
 * Hash de la contraseña con bcrypt (10 rounds) antes de guardar.
 *
 * Mongoose valida ANTES de ejecutar este hook, así que el `minlength: 6`
 * se aplica sobre la contraseña en texto plano (el hash siempre mide 60).
 * El `isModified` evita volver a hashear un hash ya guardado.
 */
usuarioSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
});

/**
 * Compara una contraseña en texto plano con el hash guardado.
 * Requiere haber cargado el usuario con .select("+password").
 */
usuarioSchema.methods.compararPassword = async function (candidata) {
  if (!this.password) return false;
  return bcrypt.compare(candidata, this.password);
};

// _id → id; se eliminan __v y password de cualquier respuesta JSON.
usuarioSchema.set("toJSON", {
  transform(_doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    delete ret.password;
    return ret;
  },
});

export default mongoose.model("Usuario", usuarioSchema);
