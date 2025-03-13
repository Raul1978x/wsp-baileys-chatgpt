// src/flow/dto/create-flow.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateFlowDto {
  @ApiProperty({
    example: 'Flujo de Bienvenida',
    description: 'Nombre único del flujo',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre del flujo es obligatorio' })
  name: string;

  @ApiProperty({
    example: 'Este flujo da la bienvenida a los usuarios nuevos.',
    description: 'Descripción opcional del flujo',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 1,
    description: 'Orden del flujo (número entero)',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty({ message: 'El orden del flujo es obligatorio' })
  order: number;

  @ApiProperty({
    example: 'agent-id-123',
    description: 'ID del agente que crea el flujo',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'El ID del agente es obligatorio' })
  agentId: string;
}
