/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import { StartSessionDto } from './dto/start-session.dto';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class WhatsAppService {
  private sessions: Map<string, any> = new Map();

  /*************  ✨ Codeium Command ⭐  *************/
  /**
   * Returns all whatsapp.
   *
   * @returns {string} A message indicating that the action returns all whatsapp.
   */
  /******  a1af8be9-1a1c-48b5-9b21-59779b3ff52e  *******/ async startSession(
    dto: StartSessionDto,
  ) {
    const { sessionName } = dto;
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
  }

  async sendMessage(dto: SendMessageDto) {
    const { chatId, message } = dto;
    for (const session of this.sessions.values()) {
      await session.sendMessage(chatId, { text: message });
    }
  }
}
