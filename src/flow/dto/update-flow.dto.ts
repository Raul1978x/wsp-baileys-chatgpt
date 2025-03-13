// src/flow/dto/update-flow.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateFlowDto {
  @ApiProperty({
    example: 'Flujo de Despedida',
    description: 'Nuevo nombre del flujo (opcional)',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'Este flujo despide a los usuarios.',
    description: 'Nueva descripción del flujo (opcional)',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 2,
    description: 'Nuevo orden del flujo (opcional)',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  order?: number;
}
