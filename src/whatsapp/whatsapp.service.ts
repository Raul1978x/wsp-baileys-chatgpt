// whatsapp.service.ts
import { Injectable, Logger } from '@nestjs/common';
import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  AnyMessageContent,
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import { StartSessionDto } from './dto/start-session.dto';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class WhatsAppService {
  private readonly logger = new Logger(WhatsAppService.name);
  private sessions: Map<string, any> = new Map();

  async startSession(dto: StartSessionDto): Promise<void> {
    const { sessionName } = dto;

    if (this.sessions.has(sessionName)) {
      this.logger.warn(`La sesión "${sessionName}" ya está activa.`);
      return;
    }

    try {
      const { state, saveCreds } = await useMultiFileAuthState(
        `./auth/${sessionName}`,
      );

      const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
      });

      sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
          const shouldReconnect =
            (lastDisconnect?.error as Boom)?.output?.statusCode !==
            DisconnectReason.loggedOut;
          if (shouldReconnect) this.startSession(dto);
        }
      });

      sock.ev.on('creds.update', saveCreds);
      this.sessions.set(sessionName, sock);
    } catch (error) {
      this.logger.error(`Error al iniciar sesión "${sessionName}":`, error);
      throw error;
    }
  }

  async sendMessage(dto: SendMessageDto): Promise<void> {
    const { chatId, message } = dto;

    for (const [sessionName, session] of this.sessions.entries()) {
      try {
        await session.sendMessage(chatId, {
          text: message,
        } as AnyMessageContent);
        this.logger.log(
          `Mensaje enviado desde la sesión "${sessionName}" a "${chatId}".`,
        );
      } catch (error) {
        this.logger.error(
          `Error al enviar mensaje desde la sesión "${sessionName}":`,
          error,
        );
        throw error;
      }
    }
  }
}
