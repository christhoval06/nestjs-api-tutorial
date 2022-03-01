import { Global, Logger } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Inject, forwardRef } from '@nestjs/common';
import { AuthService } from './auth/auth.service';

/**
 *	Important URIs:
 *	https://docs.nestjs.com/websockets/gateways
 *	https://socket.io/docs/server-api/
 *	https://socket.io/docs/client-api/
 */
// @WebSocketGateway({serveClient: true})
@WebSocketGateway({ namespace: 'app' })
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  // constructor(
  //   @Inject(forwardRef(() => AuthService))
  //   private readonly authService: AuthService,
  // ) {}

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  afterInit(server: Server) {
    this.logger.log('Initialized .....');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  @SubscribeMessage('send_user_login')
  listenForNewUserLogin(@MessageBody() data: string) {
    this.server.sockets.emit('receive_user_login', data);
  }

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, payload: string): WsResponse<string> {
    this.logger.log(`Message received for ${client.id}`);
    this.logger.log(payload);
    this.server.emit('msgToClient', payload); // send data to every client
    // client.emit('messageToClient', payload); // send data to client socket only
    return { event: 'msgToClient', data: payload }; // send data to client socket only
  }
}
