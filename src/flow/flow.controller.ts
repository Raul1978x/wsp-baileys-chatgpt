/* eslint-disable @typescript-eslint/no-unsafe-return */
// src/flow/flows.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { FlowsService } from './flow.service';
import { CreateFlowDto } from './dto/create-flow.dto';
import { UpdateFlowDto } from './dto/update-flow.dto';

@ApiTags('Flows') // Agrupa los endpoints bajo "Flows" en Swagger
@Controller('flows')
export class FlowsController {
  constructor(private readonly flowsService: FlowsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo flujo' })
  @ApiBody({ type: CreateFlowDto })
  @ApiResponse({
    status: 201,
    description: 'Flujo creado exitosamente',
    schema: {
      example: {
        id: 'uuid-del-flujo',
        name: 'Flujo de Bienvenida',
        description: 'Este flujo da la bienvenida a los usuarios nuevos.',
        order: 1,
        agentId: 'agent-id-123',
      },
    },
  })
  async create(@Body() createFlowDto: CreateFlowDto) {
    return this.flowsService.create(createFlowDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los flujos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de flujos',
    schema: {
      example: [
        {
          id: 'uuid-del-flujo',
          name: 'Flujo de Bienvenida',
          description: 'Este flujo da la bienvenida a los usuarios nuevos.',
          order: 1,
          agentId: 'agent-id-123',
        },
      ],
    },
  })
  async findAll() {
    return this.flowsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un flujo por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID del flujo',
    example: 'uuid-del-flujo',
  })
  @ApiResponse({
    status: 200,
    description: 'Flujo encontrado',
    schema: {
      example: {
        id: 'uuid-del-flujo',
        name: 'Flujo de Bienvenida',
        description: 'Este flujo da la bienvenida a los usuarios nuevos.',
        order: 1,
        agentId: 'agent-id-123',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Flujo no encontrado' })
  async findOne(@Param('id') id: string) {
    return this.flowsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un flujo existente' })
  @ApiParam({
    name: 'id',
    description: 'ID del flujo',
    example: 'uuid-del-flujo',
  })
  @ApiBody({ type: UpdateFlowDto })
  @ApiResponse({
    status: 200,
    description: 'Flujo actualizado exitosamente',
    schema: {
      example: {
        id: 'uuid-del-flujo',
        name: 'Flujo de Despedida',
        description: 'Este flujo despide a los usuarios.',
        order: 2,
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Flujo no encontrado' })
  async update(@Param('id') id: string, @Body() updateFlowDto: UpdateFlowDto) {
    return this.flowsService.update(id, updateFlowDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un flujo existente' })
  @ApiParam({
    name: 'id',
    description: 'ID del flujo',
    example: 'uuid-del-flujo',
  })
  @ApiResponse({
    status: 200,
    description: 'Flujo eliminado exitosamente',
    schema: {
      example: {
        message: 'Flujo eliminado correctamente',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Flujo no encontrado' })
  async remove(@Param('id') id: string) {
    return this.flowsService.remove(id);
  }
}
