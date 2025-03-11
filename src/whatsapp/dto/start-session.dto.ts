// src/whatsapp/dto/start-session.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class StartSessionDto {
  @ApiProperty({
    example: 'session1',
    description: 'Nombre único para la sesión de WhatsApp',
  })
  @IsString()
  sessionName: string;
}
