/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
} from '@whiskeysockets/baileys';
import qrcode from 'qrcode';

@Injectable()
export class SessionsService {
  private sessions: Map<string, any> = new Map();
  private qrCodes: Map<string, string> = new Map();

  constructor(private readonly prisma: PrismaService) {}

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
      printQRInTerminal: false,
    });

    sock.ev.on('connection.update', async (update) => {
      const { connection, qr, lastDisconnect } = update;

      if (qr) {
        const qrCode = await qrcode.toDataURL(qr);
        this.qrCodes.set(sessionName, qrCode);
        await this.prisma.session.update({
          where: { sessionName },
          data: { qrCode, qrGeneratedAt: new Date() },
        });

        // Programamos la eliminación automática del QR después de 60 segundos si no se escanea
        setTimeout(async () => {
          const currentSession = await this.prisma.session.findUnique({
            where: { sessionName },
          });
          if (currentSession && currentSession.qrCode) {
            const generatedAt = currentSession.qrGeneratedAt;
            if (generatedAt) {
              const elapsed = Date.now() - new Date(generatedAt).getTime();
              if (elapsed >= 60000) {
                await this.prisma.session.update({
                  where: { sessionName },
                  data: { qrCode: null, qrGeneratedAt: null },
                });
                console.log(
                  `QR code para la sesión ${sessionName} expiró y fue eliminado.`,
                );
              }
            }
          }
        }, 60000);
      }

      if (connection === 'open') {
        await this.prisma.session.update({
          where: { sessionName },
          data: { isActive: true, qrCode: null },
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
  }

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

  async getQRCode(sessionName: string) {
    const session = await this.prisma.session.findUnique({
      where: { sessionName },
    });

    if (!session || !session.qrCode) {
      throw new NotFoundException(
        'No se encontró un código QR para esta sesión',
      );
    }

    return { qrCode: session.qrCode };
  }
}
