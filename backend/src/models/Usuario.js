import bcrypt from "bcryptjs";
import mongoose from "mongoose";

export const ROLES = ["admin", "editor", "cliente"];
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
      // Quien entra con Google no tiene contraseña propia.
      required: [
        function () {
          return !this.googleId;
        },
        "La contraseña es obligatoria",
      ],
      minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
      select: false,
    },
    // Identificador de la cuenta de Google (campo "sub" del ID token).
    googleId: { type: String, unique: true, sparse: true },
    rol: {
      type: String,
      enum: { values: ROLES, message: "Rol inválido: {VALUE}" },
      default: "cliente",
    },
  },
  { timestamps: true },
);

usuarioSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
});

usuarioSchema.methods.compararPassword = async function (candidata) {
  if (!this.password) return false;
  return bcrypt.compare(candidata, this.password);
};

usuarioSchema.set("toJSON", {
  transform(_doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    delete ret.password;
    // El id de Google no sale en el JSON; solo un indicador para que el front
    // sepa que la cuenta usa Google (y oculte el cambio de contraseña).
    ret.conGoogle = Boolean(ret.googleId);
    delete ret.googleId;
    return ret;
  },
});

export default mongoose.model("Usuario", usuarioSchema);