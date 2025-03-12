// src/sessions/sessions.controller.ts
import {
  Controller,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';

@ApiTags('Sessions') // Agrupa los endpoints bajo "Sessions" en Swagger
@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  /**
   * Crear una nueva sesión.
   * @param createSessionDto - Datos para crear la sesión.
   * @returns La sesión creada.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una nueva sesión' })
  @ApiBody({ type: CreateSessionDto }) // Define el cuerpo de la solicitud
  @ApiResponse({
    status: 201,
    description: 'La sesión ha sido creada exitosamente',
    type: CreateSessionDto,
  })
  @ApiResponse({ status: 409, description: 'El nombre de la sesión ya existe' })
  async create(@Body() createSessionDto: CreateSessionDto) {
    return this.sessionsService.createSession(createSessionDto.sessionName);
  }

  /**
   * Iniciar una sesión existente.
   * @param sessionName - Nombre de la sesión a iniciar.
   * @returns Mensaje indicando que la sesión ha sido iniciada.
   */
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
  @ApiResponse({ status: 404, description: 'Sesión no encontrada' })
  async start(@Param('sessionName') sessionName: string) {
    return this.sessionsService.startSession(sessionName);
  }

  /**
   * Detener una sesión existente.
   * @param sessionName - Nombre de la sesión a detener.
   * @returns Mensaje indicando que la sesión ha sido detenida.
   */
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
  @ApiResponse({ status: 404, description: 'Sesión no encontrada' })
  async stop(@Param('sessionName') sessionName: string) {
    return this.sessionsService.stopSession(sessionName);
  }
}
