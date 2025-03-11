// src/whatsapp/whatsapp.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { WhatsAppService } from './whatsapp.service';
import { StartSessionDto } from './dto/start-session.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('WhatsApp') // Etiqueta para agrupar los endpoints de WhatsApp
@Controller('whatsapp')
export class WhatsAppController {
  constructor(private readonly whatsappService: WhatsAppService) {}

  @Post('start')
  @ApiOperation({ summary: 'Iniciar una nueva sesión de WhatsApp' })
  @ApiBody({ type: StartSessionDto })
  @ApiResponse({ status: 200, description: 'Sesión iniciada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  startSession(@Body() startSessionDto: StartSessionDto) {
    return this.whatsappService.startSession(startSessionDto);
  }

  @Post('send')
  @ApiOperation({ summary: 'Enviar un mensaje a través de WhatsApp' })
  @ApiBody({ type: SendMessageDto })
  @ApiResponse({ status: 200, description: 'Mensaje enviado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  sendMessage(@Body() sendMessageDto: SendMessageDto) {
    return this.whatsappService.sendMessage(sendMessageDto);
  }
}
