import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import Product from "./models/Product.js";

/**
 * Script de seed: borra todos los productos existentes y carga el
 * catálogo inicial de "Mueblería Jota" en MongoDB.
 *
 * Reemplaza al viejo `src/data/productos.js` del sprint anterior: ahora
 * la "base de datos" real es MongoDB, y este archivo es solo el punto
 * de partida para no arrancar con la colección vacía.
 *
 * Uso:
 *   npm run seed
 */
const productosIniciales = [
  {
    nombre: "Aparador Uspallata",
    categoria: "living",
    precio: 950000,
    stock: 6,
    imagenUrl: "/img/aparador-uspallata.png",
    descripcion:
      "Aparador de seis puertas fabricado en nogal sostenible con tiradores metálicos en acabado latón. Su silueta minimalista realza el veteado natural de la madera, creando una pieza que combina funcionalidad y elegancia atemporal.",
    destacado: true,
  },
  {
    nombre: "Biblioteca Recoleta",
    categoria: "living",
    precio: 680000,
    stock: 10,
    imagenUrl: "/img/biblioteca-recoleta.png",
    descripcion:
      "Sistema modular de estantes abierto que combina estructura de acero Sage Green y repisas en roble claro. Perfecta para colecciones y objetos de diseño, se adapta a cualquier espacio contemporáneo.",
    destacado: false,
  },
  {
    nombre: "Butaca Mendoza",
    categoria: "living",
    precio: 540000,
    stock: 14,
    imagenUrl: "/img/butaca-mendoza.png",
    descripcion:
      "Butaca tapizada en bouclé Dusty Rose con base de madera de guatambú. El respaldo curvo abraza el cuerpo y ofrece máximo confort, con un diseño orgánico que aporta calidez a cualquier ambiente.",
    destacado: false,
  },
  {
    nombre: "Sillón Copacabana",
    categoria: "living",
    precio: 890000,
    stock: 5,
    imagenUrl: "/img/sillon-copacabana.png",
    descripcion:
      "Sillón lounge en cuero cognac con base giratoria en acero Burnt Sienna. Inspirado en la estética brasilera moderna de los años 60, combina comodidad excepcional con un diseño icónico.",
    destacado: true,
  },
  {
    nombre: "Mesa de Centro Araucaria",
    categoria: "living",
    precio: 610000,
    stock: 9,
    imagenUrl: "/img/mesa-araucaria.png",
    descripcion:
      "Mesa de centro con sobre circular de mármol Patagonia y base de tres patas en madera de nogal. Su diseño minimalista la convierte en el punto focal perfecto de cualquier sala de estar.",
    destacado: false,
  },
  {
    nombre: "Mesa de Noche Aconcagua",
    categoria: "dormitorio",
    precio: 275000,
    stock: 18,
    imagenUrl: "/img/mesa-aconcagua.png",
    descripcion:
      "Mesa de noche con cajón oculto y repisa inferior en roble certificado FSC®. Su diseño limpio y funcional convive con diferentes estilos de dormitorio, con almacenamiento discreto y elegante.",
    destacado: false,
  },
  {
    nombre: "Sofá Patagonia",
    categoria: "living",
    precio: 1250000,
    stock: 4,
    imagenUrl: "/img/sofa-patagonia.png",
    descripcion:
      "Sofá de tres cuerpos tapizado en lino Warm Alabaster con patas cónicas de madera. Los cojines combinan espuma de alta resiliencia con plumón reciclado, comodidad duradera y sostenible.",
    destacado: true,
  },
  {
    nombre: "Mesa Comedor Pampa",
    categoria: "comedor",
    precio: 980000,
    stock: 7,
    imagenUrl: "/img/mesa-pampa.png",
    descripcion:
      "Mesa extensible de roble macizo con tablero biselado y sistema de apertura suave. Su diseño robusto y elegante se adapta a reuniones íntimas o grandes celebraciones, de 6 a 10 comensales.",
    destacado: true,
  },
  {
    nombre: "Sillas Córdoba (set x4)",
    categoria: "comedor",
    precio: 420000,
    stock: 12,
    imagenUrl: "/img/sillas-cordoba.png",
    descripcion:
      "Set de cuatro sillas apilables en contrachapado moldeado de nogal y estructura tubular pintada en Sage Green. Diseño ergonómico y materiales de calidad para el uso diario.",
    destacado: false,
  },
  {
    nombre: "Escritorio Costa",
    categoria: "oficina",
    precio: 465000,
    stock: 11,
    imagenUrl: "/img/escritorio-costa.png",
    descripcion:
      "Escritorio compacto con cajón organizado y tapa pasacables integrada en bambú laminado. Ideal para espacios de trabajo en casa, combina funcionalidad moderna con estética minimalista.",
    destacado: false,
  },
  {
    nombre: "Silla de Trabajo Belgrano",
    categoria: "oficina",
    precio: 385000,
    stock: 16,
    imagenUrl: "/img/silla-belgrano.png",
    descripcion:
      "Silla ergonómica regulable en altura con respaldo de malla transpirable y asiento tapizado en tejido reciclado. Diseñada para largas jornadas de trabajo con máximo confort y apoyo lumbar.",
    destacado: false,
  },
];

async function seed() {
  await connectDB();

  console.log("🗑️  Borrando productos existentes...");
  await Product.deleteMany({});

  console.log(`🌱 Insertando ${productosIniciales.length} productos...`);
  await Product.insertMany(productosIniciales);

  console.log("✅ Seed completado con éxito.");
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Error al ejecutar el seed:", error);
  process.exit(1);
});
