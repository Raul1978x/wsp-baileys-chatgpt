// src/sessions/dto/update-session.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateSessionDto {
  @ApiProperty({
    example: 'nueva-sesion',
    description: 'Nuevo nombre de la sesión (opcional)',
    required: false,
  })
  @IsString()
  @IsOptional()
  sessionName?: string;

  @ApiProperty({
    example: false,
    description: 'Estado de la sesión (activo/inactivo)',
    required: false,
  })
  @IsOptional()
  isActive?: boolean;
}
