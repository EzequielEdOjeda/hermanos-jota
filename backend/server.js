import "dotenv/config";
import app from "./src/app.js";

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor de Hermanos Jota corriendo en http://localhost:${PORT}`);
});
