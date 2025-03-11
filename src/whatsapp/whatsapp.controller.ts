import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { WhatsAppService } from './whatsapp.service';
import { StartSessionDto } from './dto/start-session.dto';
import { SendMessageDto } from './dto/send-message.dto';

@ApiTags('WhatsApp') // Agrupa los endpoints bajo "WhatsApp" en Swagger
@Controller('whatsapp')
export class WhatsAppController {
  constructor(private readonly whatsappService: WhatsAppService) {}

  @Post('start')
  @ApiOperation({ summary: 'Iniciar una nueva sesión de WhatsApp' })
  @ApiBody({ type: StartSessionDto }) // Define el DTO esperado en el cuerpo
  @ApiResponse({ status: 200, description: 'Sesión iniciada correctamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe()) // Valida el DTO automáticamente
  async startSession(@Body() startSessionDto: StartSessionDto) {
    return this.whatsappService.startSession(startSessionDto);
  }

  @Post('send')
  @ApiOperation({ summary: 'Enviar un mensaje a través de WhatsApp' })
  @ApiBody({ type: SendMessageDto })
  @ApiResponse({ status: 200, description: 'Mensaje enviado correctamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiBearerAuth('access-token') // Indica que este endpoint requiere autenticación JWT
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  async sendMessage(@Body() sendMessageDto: SendMessageDto) {
    return this.whatsappService.sendMessage(sendMessageDto);
  }
}
