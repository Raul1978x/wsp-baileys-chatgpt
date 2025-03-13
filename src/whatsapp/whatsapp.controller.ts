/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Post, Param, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { WhatsAppService } from './whatsapp.service';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Prisma } from '@prisma/client'; // Importa el tipo User desde Prisma

@ApiTags('WhatsApp') // Agrupa los endpoints bajo la etiqueta "WhatsApp" en Swagger
@ApiBearerAuth() // Indica que estos endpoints requieren autenticación JWT
@Controller('whatsapp')
@UseGuards(AuthGuard('jwt')) // Protege todas las rutas con autenticación JWT
export class WhatsAppController {
  constructor(private readonly whatsAppService: WhatsAppService) {}

  /**
   * Inicia una nueva sesión de WhatsApp.
   * @param sessionName Nombre único de la sesión a iniciar.
   * @param user Usuario autenticado (obtenido del token JWT).
   * @returns Un mensaje indicando que la sesión fue iniciada correctamente o un código QR para escanear.
   */
  @Post(':sessionName/start')
  @ApiOperation({ summary: 'Iniciar una nueva sesión de WhatsApp' })
  @ApiParam({
    name: 'sessionName',
    description: 'Nombre único de la sesión',
    example: 'sesion-ejemplo',
  })
  @ApiResponse({
    status: 200,
    description: 'Sesión iniciada exitosamente',
    schema: {
      example: {
        message: 'Sesión iniciada correctamente',
        qrCode: 'https://example.com/qrcode', // Código QR para escanear si es necesario
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o sesión ya activa',
  })
  async startSession(
    @Param('sessionName') sessionName: string,
    @GetUser() user: Prisma.User, // Obtiene el usuario autenticado desde el token JWT
  ) {
    return this.whatsAppService.startSession(sessionName, user.id);
  }

  /**
   * Envía un mensaje a través de una sesión de WhatsApp existente.
   * @param sessionName Nombre único de la sesión a utilizar.
   * @param chatId ID del chat o contacto (formato WhatsApp).
   * @param message Contenido del mensaje a enviar.
   * @param user Usuario autenticado (obtenido del token JWT).
   * @returns Un mensaje indicando que el mensaje fue enviado correctamente.
   */
  @Post(':sessionName/send')
  @ApiOperation({
    summary: 'Enviar un mensaje a través de una sesión de WhatsApp',
  })
  @ApiParam({
    name: 'sessionName',
    description: 'Nombre único de la sesión',
    example: 'sesion-ejemplo',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        chatId: {
          type: 'string',
          example: '123456789@c.us', // Ejemplo de ID de chat en formato WhatsApp
        },
        message: {
          type: 'string',
          example: 'Hola, este es un mensaje automatizado.',
        },
      },
      required: ['chatId', 'message'], // Ambos campos son obligatorios
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Mensaje enviado exitosamente',
    schema: {
      example: {
        message: 'Mensaje enviado correctamente',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o sesión inactiva',
  })
  @ApiResponse({
    status: 404,
    description: 'Sesión no encontrada',
  })
  async sendMessage(
    @Param('sessionName') sessionName: string,
    @Body('chatId') chatId: string,
    @Body('message') message: string,
    @GetUser() user: Prisma.User, // Obtiene el usuario autenticado desde el token JWT
  ) {
    return this.whatsAppService.sendMessage(
      sessionName,
      chatId,
      message,
      user.id,
    );
  }
}
