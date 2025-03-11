/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// src/sessions/baileys.provider.ts
import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';

export class BaileysProvider {
  private sessions: Map<string, any> = new Map();

  async startSession(sessionName: string) {
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
          await this.startSession(sessionName); // Intentar reconectar
        }
      }
    });

    sock.ev.on('creds.update', saveCreds);
    this.sessions.set(sessionName, sock);
  }

  getSession(sessionName: string) {
    return this.sessions.get(sessionName);
  }

  closeSession(sessionName: string) {
    const sock = this.sessions.get(sessionName);
    if (sock) {
      sock.logout();
      this.sessions.delete(sessionName);
    }
  }
}
