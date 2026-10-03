import mongoose from "mongoose";

/**
 * Conexión a MongoDB (Atlas) usando Mongoose.
 *
 * La cadena de conexión NUNCA se hardcodea: se lee desde la variable de
 * entorno `MONGODB_URI` (ver `.env.example`), tal como pide el objetivo
 * de "gestionar la configuración y los secretos de forma segura".
 *
 * Si la conexión falla, el servidor no tiene sentido que siga arriba
 * (ninguna ruta de productos podría funcionar), así que se corta el
 * proceso con un mensaje claro en vez de dejarlo "medio prendido".
 */
export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error(
      "❌ Falta la variable de entorno MONGODB_URI. Copiá .env.example a .env y completá la cadena de conexión de tu cluster de MongoDB Atlas.",
    );
    process.exit(1);
  }

  try {
    const conexion = await mongoose.connect(uri);
    console.log(`🍃 MongoDB conectado → host: ${conexion.connection.host}`);
  } catch (error) {
    console.error("❌ No se pudo conectar a MongoDB:", error.message);
    process.exit(1);
  }
}

export default connectDB;
