/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class FlowsService {
  constructor(private readonly prisma: PrismaService) {}

  async createFlow(
    agentId: string,
    name: string,
    description: string,
    order: number,
  ) {
    return this.prisma.flow.create({
      data: { name, description, order, agentId },
    });
  }

  async updateFlowOrder(flowId: string, newOrder: number) {
    return this.prisma.flow.update({
      where: { id: flowId },
      data: { order: newOrder },
    });
  }

  async getFlowsByAgent(agentId: string) {
    return this.prisma.flow.findMany({
      where: { agentId },
      orderBy: { order: 'asc' },
      include: { triggers: true, responses: true },
    });
  }
}
