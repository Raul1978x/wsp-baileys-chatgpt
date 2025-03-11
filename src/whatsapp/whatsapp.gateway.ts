/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
// @ts-ignore
import { Server } from 'socket.io';
import { WhatsAppService } from './whatsapp.service';

@WebSocketGateway()
export class WhatsAppGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly whatsappService: WhatsAppService) {}

  @SubscribeMessage('sendMessage')
  async handleMessage(client: any, payload: any) {
    await this.whatsappService.sendMessage(payload);
    this.server.emit('messageSent', payload);
  }
}
