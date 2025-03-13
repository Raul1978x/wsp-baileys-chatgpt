/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Crear una empresa
  const company = await prisma.company.create({
    data: { name: 'Empresa Demo', plan: 'PREMIUM', maxAgents: 5 },
  });

  // Crear un agente
  const agent = await prisma.user.create({
    data: {
      email: 'agente@example.com',
      password: 'contraseña123',
      role: 'AGENT',
      companyId: company.id,
    },
  });

  // Crear un flujo
  const flow = await prisma.flow.create({
    data: {
      name: 'Flujo de Bienvenida',
      description: 'Flujo para dar la bienvenida a los usuarios',
      order: 1,
      agentId: agent.id,
    },
  });

  // Crear un trigger
  await prisma.trigger.create({
    data: {
      keyword: 'hola',
      flowId: flow.id,
    },
  });

  // Crear una respuesta
  await prisma.response.create({
    data: {
      content: '¡Hola! ¿Cómo podemos ayudarte hoy?',
      flowId: flow.id,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
