/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Post,
  Param,
  Body,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Res,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiOkResponse,
  ApiProduces,
} from '@nestjs/swagger';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { PrismaService } from '../database/prisma.service';
import { Response } from 'express';

@ApiTags('Sessions')
@Controller('sessions')
export class SessionsController {
  constructor(
    private readonly sessionsService: SessionsService,
    private readonly prisma: PrismaService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una nueva sesión' })
  @ApiBody({ type: CreateSessionDto })
  @ApiResponse({
    status: 201,
    description: 'La sesión ha sido creada exitosamente',
  })
  async create(@Body() body: { sessionName: string }) {
    return this.sessionsService.createSession(body.sessionName);
  }

  @Post(':sessionName/start')
  @ApiOperation({ summary: 'Iniciar una sesión existente' })
  @ApiParam({
    name: 'sessionName',
    description: 'Nombre de la sesión',
    example: 'mi-sesion',
  })
  @ApiResponse({
    status: 200,
    description: 'La sesión ha sido iniciada exitosamente',
  })
  async start(@Param('sessionName') sessionName: string) {
    return this.sessionsService.startSession(sessionName);
  }

  @Post(':sessionName/stop')
  @ApiOperation({ summary: 'Detener una sesión existente' })
  @ApiParam({
    name: 'sessionName',
    description: 'Nombre de la sesión',
    example: 'mi-sesion',
  })
  @ApiResponse({
    status: 200,
    description: 'La sesión ha sido detenida exitosamente',
  })
  async stop(@Param('sessionName') sessionName: string) {
    return this.sessionsService.stopSession(sessionName);
  }

  // @Get(':sessionName/qr')
  // @ApiOperation({ summary: 'Obtener el código QR de una sesión' })
  // @ApiParam({
  //   name: 'sessionName',
  //   description: 'Nombre de la sesión',
  //   example: 'mi-sesion',
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Código QR obtenido exitosamente',
  // })
  // async getQR(@Param('sessionName') sessionName: string) {
  //   return this.sessionsService.getQRCode(sessionName);
  // }
  @Get(':sessionName/qr')
  @ApiProduces('image/png')
  @ApiOkResponse({
    description: 'Imagen QR en formato PNG',
    content: {
      'image/png': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async getQRCode(
    @Param('sessionName') sessionName: string,
    @Res() res: Response,
  ) {
    const session = await this.prisma.session.findUnique({
      where: { sessionName },
    });

    if (!session || !session.qrCode) {
      throw new NotFoundException('No se encontró un código QR para esta sesión');
    }

    // Si el campo contiene el prefijo "data:image/png;base64,", lo eliminamos
    const base64Data = session.qrCode.replace(/^data:image\/\w+;base64,/, '');
    const imgBuffer = Buffer.from(base64Data, 'base64');

    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': imgBuffer.length,
    });
    res.end(imgBuffer);
  }
}
