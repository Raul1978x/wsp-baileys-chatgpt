// src/whatsapp/dto/send-message.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SendMessageDto {
  @ApiProperty({
    example: '123456789@c.us',
    description: 'ID del chat o contacto (formato WhatsApp)',
  })
  @IsString()
  chatId: string;

  @ApiProperty({
    example: 'Hola, este es un mensaje automatizado.',
    description: 'Contenido del mensaje a enviar',
  })
  @IsString()
  message: string;
}
