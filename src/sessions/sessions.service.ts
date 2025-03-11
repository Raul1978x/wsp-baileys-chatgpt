/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// src/sessions/sessions.service.ts
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import { PrismaService } from '../database/prisma.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

@Injectable()
export class SessionsService {
  private sessions: Map<string, any> = new Map();

  constructor(private prisma: PrismaService) {}

  // Iniciar una nueva sesión
  async create(createSessionDto: CreateSessionDto) {
    const { sessionName } = createSessionDto;

    // Verificar si la sesión ya existe
    const existingSession = await this.prisma.session.findUnique({
      where: { sessionName },
    });

    if (existingSession) {
      throw new ConflictException('La sesión ya existe');
    }

    // Crear la sesión en la base de datos
    const session = await this.prisma.session.create({
      data: { sessionName, isActive: true },
    });

    // Configurar Baileys para la sesión
    const { state, saveCreds } = await useMultiFileAuthState(
      `./auth/${sessionName}`,
    );
    const sock = makeWASocket({
      auth: state,
      printQRInTerminal: true,
    });

    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect } = update;
      if (connection === 'close') {
        const shouldReconnect =
          (lastDisconnect?.error as Boom)?.output?.statusCode !==
          DisconnectReason.loggedOut;
        if (shouldReconnect) {
          await this.create(createSessionDto); // Intentar reconectar
        }
      }
    });

    sock.ev.on('creds.update', saveCreds);
    this.sessions.set(sessionName, sock);

    return session;
  }

  // Obtener todas las sesiones
  async findAll() {
    return this.prisma.session.findMany();
  }

  // Obtener una sesión por ID
  async findOne(id: string) {
    const session = await this.prisma.session.findUnique({
      where: { id },
    });

    if (!session) {
      throw new NotFoundException(`Sesión con ID ${id} no encontrada`);
    }

    return session;
  }

  // Actualizar una sesión
  async update(id: string, updateSessionDto: UpdateSessionDto) {
    const session = await this.prisma.session.findUnique({
      where: { id },
    });

    if (!session) {
      throw new NotFoundException(`Sesión con ID ${id} no encontrada`);
    }

    return this.prisma.session.update({
      where: { id },
      data: updateSessionDto,
    });
  }

  // Eliminar una sesión
  async remove(id: string) {
    const session = await this.prisma.session.findUnique({
      where: { id },
    });

    if (!session) {
      throw new NotFoundException(`Sesión con ID ${id} no encontrada`);
    }

    // Cerrar la sesión activa
    const sock = this.sessions.get(session.sessionName);
    if (sock) {
      await sock.logout();
      this.sessions.delete(session.sessionName);
    }

    return this.prisma.session.delete({
      where: { id },
    });
  }
}
