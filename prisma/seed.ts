import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  // Evitar duplicados: elimina si ya existe
  await prisma.user.deleteMany({ where: { username: "admin" } });

  const user = await prisma.user.create({
    data: {
      name: "Admin",
      lastname: "Test",
      username: "admin",
      password: "admin123",
    },
  });

  console.log("✅ Usuario creado:", user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

