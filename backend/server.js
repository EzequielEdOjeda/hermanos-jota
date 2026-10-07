import "dotenv/config";
import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";

const PORT = process.env.PORT || 4000;

// Sin estas variables la API no puede funcionar: se corta antes de arrancar
// con un mensaje claro, en vez de fallar más tarde con un error 500 confuso.
const faltantes = ["MONGODB_URI", "JWT_SECRET"].filter((nombre) => !process.env[nombre]);

if (faltantes.length > 0) {
  console.error(`❌ Faltan variables de entorno: ${faltantes.join(", ")}`);
  console.error("   Copiá backend/.env.example a backend/.env y completalo.");
  process.exit(1);
}

const SECRETO_DE_EJEMPLO = "cambia-esto-por-un-string-largo";

if (process.env.JWT_SECRET === SECRETO_DE_EJEMPLO || process.env.JWT_SECRET.length < 32) {
  console.warn(
    "⚠️  JWT_SECRET es corto o es el valor de ejemplo: usá un string largo y aleatorio.",
  );
}

async function iniciar() {
  // Primero la base de datos; si falla, connectDB termina el proceso (exit 1).
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Servidor de Hermanos Jota corriendo en http://localhost:${PORT}`);
  });
}

iniciar();
