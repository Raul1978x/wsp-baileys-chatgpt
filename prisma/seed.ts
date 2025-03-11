/* eslint-disable @typescript-eslint/no-misused-promises */
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // 1. Crear un usuario administrador
  const adminPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: adminPassword,
    },
  });
  console.log(`👤 Usuario administrador creado: ${adminUser.email}`);

  // 2. Crear sesiones de WhatsApp simuladas
  const session1 = await prisma.session.create({
    data: {
      sessionName: 'session1', // Asegúrate de que este campo exista en el modelo Session
      isActive: true,
    },
  });
  console.log(`📱 Sesión de WhatsApp creada: ${session1.sessionName}`);

  const session2 = await prisma.session.create({
    data: {
      sessionName: 'session2', // Asegúrate de que este campo exista en el modelo Session
      isActive: false,
    },
  });
  console.log(`📱 Sesión de WhatsApp creada: ${session2.sessionName}`);
}

main()
  .catch((e) => {
    console.error('❌ Error durante la ejecución de la seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
