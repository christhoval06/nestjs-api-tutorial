import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayDisconnect,
  OnGatewayConnection,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

/**
 * Only athorized users can send messages to this gateway.
 * https://github.com/Jon-Peppinck/linkedin-clone/blob/main/api/src/chat/gateway/chat.gateway.ts
 * https://wanago.io/2021/01/25/api-nestjs-chat-websockets/
 **/

@WebSocketGateway({ namespace: 'alerts' })
export class AlertGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger('AlertGateway');
  @WebSocketServer() wss: Server;

  afterInit(server: any) {
    this.logger.log('Initialize AlertGateway!');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  sendToAll(msg: string) {
    this.wss.emit('alertToClient', { message: msg, type: 'Alert' });
  }

  send_sign_up(user: string) {
    this.wss.emit('alertToClient', {
      message: `${user} was sign_up`,
      type: 'Alert',
    });
  }

  send_sign_in(user: string) {
    console.log('send_sign_in', user);
    this.wss.emit('alertToClient', {
      message: `${user} was sign_in`,
      type: 'Alert',
    });
  }
}
