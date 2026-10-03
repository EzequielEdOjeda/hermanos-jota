import "dotenv/config";
import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";

const PORT = process.env.PORT || 4000;

async function iniciarServidor() {
  // Nos conectamos a MongoDB ANTES de levantar el servidor: si la base
  // no está disponible, no tiene sentido aceptar peticiones que de todos
  // modos van a fallar.
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Servidor de Hermanos Jota corriendo en http://localhost:${PORT}`);
  });
}

iniciarServidor();
