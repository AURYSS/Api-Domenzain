import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as bcrypt from "bcrypt";
import "dotenv/config";
import pg from "pg";

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const username = "admin";
  const password = "Admin123!";
  
  console.log(`🚀 Iniciando seeding para el usuario: ${username}...`);

  // Hashear la contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // Upsert: Crea si no existe, actualiza si existe
  const user = await prisma.user.upsert({
    where: { username: username },
    update: {
      password: hashedPassword,
      role: "admin",
      name: "Administrador",
      lastname: "Sistema"
    },
    create: {
      username: username,
      password: hashedPassword,
      role: "admin",
      name: "Administrador",
      lastname: "Sistema"
    },
  });

  console.log("✅ Proceso de seeding completado con éxito.");
  console.log("-----------------------------------------");
  console.log(`Usuario: ${user.username}`);
  console.log(`Password: ${password} (Hashed en DB)`);
  console.log(`Rol: ${user.role}`);
  console.log("-----------------------------------------");
}

main()
  .catch((e) => {
    console.error("❌ Error durante el seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
