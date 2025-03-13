/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// src/flow/flows.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateFlowDto } from './dto/create-flow.dto';
import { UpdateFlowDto } from './dto/update-flow.dto';

@Injectable()
export class FlowsService {
  constructor(private readonly prisma: PrismaService) {}

  // Crear un nuevo flujo
  async create(createFlowDto: CreateFlowDto) {
    const { name, description, order, agentId } = createFlowDto;
    return this.prisma.flow.create({
      data: {
        name,
        description,
        order,
        agentId,
      },
    });
  }

  // Obtener todos los flujos
  async findAll() {
    return this.prisma.flow.findMany();
  }

  // Obtener un flujo por ID
  async findOne(id: string) {
    return this.prisma.flow.findUnique({
      where: { id },
    });
  }

  // Actualizar un flujo
  async update(id: string, updateFlowDto: UpdateFlowDto) {
    const { name, description, order } = updateFlowDto;
    return this.prisma.flow.update({
      where: { id },
      data: {
        name,
        description,
        order,
      },
    });
  }

  // Eliminar un flujo
  async remove(id: string) {
    return this.prisma.flow.delete({
      where: { id },
    });
  }
}
