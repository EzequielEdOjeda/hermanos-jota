/**
 * Seed de productos.
 *
 *   npm run seed             → inserta los productos que todavía no existen
 *   npm run seed -- --reset  → BORRA todos los productos y los vuelve a cargar
 *
 * Es idempotente: si ya corriste el seed, no duplica nada ni pisa los cambios
 * que un admin haya hecho desde el panel (se identifica cada producto por su
 * `slug`). Los datos salen de src/data/productos.js.
 */
import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import productosBase from "../data/productos.js";
import Producto from "../models/Producto.js";

const STOCK_INICIAL = 10;
const reiniciar = process.argv.includes("--reset");

/**
 * Traduce un producto del archivo de datos al modelo de Mongo:
 *   imagen → imagenUrl · descripcionLarga → descripcion · (sin id numérico)
 */
function aDocumento(base) {
  return {
    slug: base.slug,
    nombre: base.nombre,
    categoria: base.categoria,
    precio: base.precio,
    stock: STOCK_INICIAL,
    imagenUrl: base.imagen,
    descripcionCorta: base.descripcionCorta,
    descripcion: base.descripcionLarga,
    medidas: base.medidas,
    materiales: base.materiales,
    acabado: base.acabado,
    peso: base.peso,
    detalleExtra: base.detalleExtra,
    destacado: base.destacado,
  };
}

async function main() {
  await connectDB();
  await Producto.init(); // asegura el índice único de `slug` antes de insertar

  if (reiniciar) {
    const { deletedCount } = await Producto.deleteMany({});
    console.log(`🧹 Productos eliminados: ${deletedCount}`);
  }

  let creados = 0;
  let omitidos = 0;

  // Uno por uno (y no insertMany) para conservar el orden del catálogo.
  for (const base of productosBase) {
    if (await Producto.exists({ slug: base.slug })) {
      omitidos += 1;
      continue;
    }
    await Producto.create(aDocumento(base));
    creados += 1;
  }

  console.log(`🌱 Productos creados: ${creados} · ya existían: ${omitidos}`);
  console.log(`📦 Total en la colección: ${await Producto.countDocuments()}`);
}

main()
  .then(() => mongoose.disconnect())
  .catch(async (error) => {
    console.error("❌ Error en el seed de productos:", error.message);
    await mongoose.disconnect();
    process.exit(1);
  });
