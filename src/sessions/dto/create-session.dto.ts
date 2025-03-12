// src/sessions/dto/create-session.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateSessionDto {
  @ApiProperty({
    example: 'mi-sesion',
    description: 'Nombre único de la sesión',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la sesión es obligatorio' })
  sessionName: string;
}
