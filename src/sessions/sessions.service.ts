/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// src/sessions/sessions.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
} from '@whiskeysockets/baileys';

@Injectable()
export class SessionsService {
  private sessions: Map<string, any> = new Map();

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Crea una nueva sesión en la base de datos.
   * @param sessionName - Nombre único de la sesión.
   * @returns La sesión creada.
   * @throws NotFoundException si la sesión ya existe.
   */
  async createSession(sessionName: string) {
    const existingSession = await this.prisma.session.findUnique({
      where: { sessionName },
    });

    if (existingSession) {
      throw new NotFoundException('La sesión ya existe');
    }

    return this.prisma.session.create({
      data: { sessionName, isActive: false },
    });
  }

  /**
   * Inicia una sesión de WhatsApp.
   * @param sessionName - Nombre de la sesión a iniciar.
   * @returns Mensaje indicando que la sesión ha sido iniciada.
   * @throws NotFoundException si la sesión no existe.
   */
  async startSession(sessionName: string) {
    const session = await this.prisma.session.findUnique({
      where: { sessionName },
    });

    if (!session) {
      throw new NotFoundException('La sesión no existe');
    }

    if (this.sessions.has(sessionName)) {
      return { message: 'La sesión ya está activa' };
    }

    const { state, saveCreds } = await useMultiFileAuthState(
      `./auth/${sessionName}`,
    );
    const sock = makeWASocket({
      auth: state,
      printQRInTerminal: true,
    });

    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect } = update;

      if (connection === 'open') {
        await this.prisma.session.update({
          where: { sessionName },
          data: { isActive: true },
        });
      }

      if (connection === 'close') {
        const shouldReconnect =
          (lastDisconnect?.error as any)?.output?.statusCode !==
          DisconnectReason.loggedOut;

        if (shouldReconnect) {
          await this.startSession(sessionName);
        } else {
          await this.prisma.session.update({
            where: { sessionName },
            data: { isActive: false },
          });
        }
      }
    });

    sock.ev.on('creds.update', saveCreds);
    this.sessions.set(sessionName, sock);

    return { message: 'Sesión iniciada exitosamente' };
  }

  /**
   * Detiene una sesión de WhatsApp.
   * @param sessionName - Nombre de la sesión a detener.
   * @returns Mensaje indicando que la sesión ha sido detenida.
   * @throws NotFoundException si la sesión no existe.
   */
  async stopSession(sessionName: string) {
    const session = await this.prisma.session.findUnique({
      where: { sessionName },
    });

    if (!session) {
      throw new NotFoundException('La sesión no existe');
    }

    const sock = this.sessions.get(sessionName);
    if (sock) {
      await sock.logout();
      this.sessions.delete(sessionName);

      await this.prisma.session.update({
        where: { sessionName },
        data: { isActive: false },
      });
    }

    return { message: 'Sesión detenida exitosamente' };
  }
}
