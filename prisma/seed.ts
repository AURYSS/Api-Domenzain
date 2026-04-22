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

  // 1. Asegurar que los roles existan
  await (prisma as any).role.upsert({ where: { name: 'admin' }, update: {}, create: { name: 'admin' } });
  await (prisma as any).role.upsert({ where: { name: 'user' }, update: {}, create: { name: 'user' } });

  // 2. Upsert del Administrador con relación
  const user = await (prisma.user as any).upsert({
    where: { username: username },
    update: {
      password: hashedPassword,
      name: "Administrador",
      lastname: "Sistema",
      role: { connect: { name: "admin" } }
    },
    create: {
      username: username,
      password: hashedPassword,
      name: "Administrador",
      lastname: "Sistema",
      role: { connect: { name: "admin" } }
    },
    include: { role: true }
  });

  console.log("✅ Proceso de seeding completado con éxito.");
  console.log("-----------------------------------------");
  console.log(`Usuario: ${user.username}`);
  console.log(`Password: ${password} (Hashed en DB)`);
  console.log(`Rol: ${user.role.name}`);
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
