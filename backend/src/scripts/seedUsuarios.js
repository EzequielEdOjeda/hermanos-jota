/**
 * Seed de usuarios de prueba.
 *
 *   npm run seed:users
 *
 *   admin@hermanosjota.com   / admin123    → rol admin
 *   cliente@hermanosjota.com / cliente123  → rol cliente
 *
 * Si un usuario ya existe (mismo email) se omite, así que se puede correr
 * todas las veces que haga falta. Las contraseñas se hashean con bcrypt en el
 * hook pre("save") del modelo Usuario.
 *
 * IMPORTANTE para producción: estas credenciales son públicas (están en el
 * README). Si la base está en internet, definí SEED_ADMIN_EMAIL y
 * SEED_ADMIN_PASSWORD en backend/.env ANTES de correr este script para crear
 * un admin con datos propios.
 */
import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Usuario from "../models/Usuario.js";

const USUARIOS = [
  {
    nombre: "Administrador",
    email: process.env.SEED_ADMIN_EMAIL || "admin@hermanosjota.com",
    password: process.env.SEED_ADMIN_PASSWORD || "admin123",
    rol: "admin",
  },
  {
    nombre: "Cliente de prueba",
    email: "cliente@hermanosjota.com",
    password: "cliente123",
    rol: "cliente",
  },
];

async function main() {
  await connectDB();
  await Usuario.init(); // asegura el índice único de `email`

  for (const datos of USUARIOS) {
    const email = datos.email.trim().toLowerCase();

    if (await Usuario.exists({ email })) {
      console.log(`⏭️  ${email} ya existe, se omite`);
      continue;
    }

    await Usuario.create({ ...datos, email });
    console.log(`✅ Usuario creado: ${email} (${datos.rol})`);
  }

  console.log(`👥 Total de usuarios: ${await Usuario.countDocuments()}`);
}

main()
  .then(() => mongoose.disconnect())
  .catch(async (error) => {
    console.error("❌ Error en el seed de usuarios:", error.message);
    await mongoose.disconnect();
    process.exit(1);
  });
