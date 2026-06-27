import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// V1 sin auth: asegura un único Usuario "propietario" al que se atribuyen las
// interacciones (ADR 0007). Idempotente. Cuando llegue Supabase Auth, este usuario
// se reconcilia con el uid real (las FKs son ON UPDATE CASCADE).
const OWNER_EMAIL = "propietario@academia.local";

async function main() {
  const owner = await prisma.usuario.upsert({
    where: { email: OWNER_EMAIL },
    update: {},
    create: { nombre: "Propietario", email: OWNER_EMAIL },
  });
  console.log("Seed OK · usuario propietario:", owner.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
