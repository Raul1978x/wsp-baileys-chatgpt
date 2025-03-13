/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import makeWASocket, { DisconnectReason } from '@whiskeysockets/baileys';

@Injectable()
export class WhatsAppService {
  private sessions = new Map<string, any>();

  constructor(private readonly prisma: PrismaService) {}

  async startSession(sessionName: string, userId: string) {
    const session = await this.prisma.session.findUnique({
      where: { sessionName },
    });

    if (!session || session.userId !== userId) {
      throw new NotFoundException(
        'La sesión no existe o no pertenece al usuario',
      );
    }

    if (this.sessions.has(sessionName)) {
      return { message: 'La sesión ya está activa' };
    }

    const sock = makeWASocket({
      auth:
        session.credentials && typeof session.credentials === 'string'
          ? JSON.parse(session.credentials)
          : undefined,
      printQRInTerminal: true,
    });

    sock.ev.on('connection.update', async (update) => {
      const { connection, qr, lastDisconnect } = update;

      if (qr) {
        await this.prisma.session.update({
          where: { sessionName },
          data: { qrCode: qr },
        });
      }

      if (connection === 'open') {
        await this.prisma.session.update({
          where: { sessionName },
          data: { isActive: true, credentials: JSON.stringify(sock.authState) },
        });
      }

      if (connection === 'close') {
        const shouldReconnect =
          (lastDisconnect?.error as any)?.output?.statusCode !==
          DisconnectReason.loggedOut;

        if (shouldReconnect) {
          this.startSession(sessionName, userId);
        } else {
          await this.prisma.session.update({
            where: { sessionName },
            data: { isActive: false },
          });
        }
      }
    });

    this.sessions.set(sessionName, sock);

    return {
      message: 'Sesión iniciada. Escanea el código QR si es necesario.',
    };
  }

  async sendMessage(
    sessionName: string,
    chatId: string,
    message: string,
    userId: string,
  ) {
    const session = await this.prisma.session.findUnique({
      where: { sessionName },
    });

    if (!session || session.userId !== userId) {
      throw new NotFoundException(
        'La sesión no existe o no pertenece al usuario',
      );
    }

    const sock = this.sessions.get(sessionName);
    if (!sock) {
      throw new NotFoundException('La sesión no está activa');
    }

    await sock.sendMessage(chatId, { text: message });

    return { message: 'Mensaje enviado correctamente' };
  }
}
