import mongoose from "mongoose";

/**
 * Conecta Mongoose a MongoDB usando la variable MONGODB_URI.
 *
 * Si la conexión falla, el proceso termina con código 1: no tiene sentido
 * dejar levantada una API de productos y usuarios sin base de datos (y así
 * Render marca el deploy como fallido en lugar de servir errores 500).
 */
export async function connectDB() {
  // Ignora en los filtros las propiedades que no existen en el schema.
  mongoose.set("strictQuery", true);

  try {
    const { connection } = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // falla rápido si la IP no está habilitada en Atlas
    });
    // Nunca se loguea la URI completa: contiene la contraseña.
    console.log(`🍃 MongoDB conectado → ${connection.host}/${connection.name}`);
  } catch (error) {
    console.error("❌ No se pudo conectar a MongoDB:", error.message);
    process.exit(1);
  }
}
