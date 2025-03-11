// src/whatsapp/whatsapp.gateway.ts
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class WhatsAppGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('sendMessage')
  handleMessage(client: any, payload: any): void {
    console.log('Mensaje recibido:', payload);
    this.server.emit('messageSent', payload); // Envía una respuesta a todos los clientes conectados
  }
}
