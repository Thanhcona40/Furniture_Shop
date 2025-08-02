import {WebSocketGateway,WebSocketServer, SubscribeMessage,OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WebsocketService } from './websocket.service';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
    credentials: true,
  },
})
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly websocketService: WebsocketService) {}

  async handleConnection(client: Socket) {
    try {
      // Xác thực JWT token từ query params hoặc headers
      const token = client.handshake.auth.token || client.handshake.query.token;
      
      if (token) {
        console.log('Token:', token);
        const user = await this.websocketService.validateToken(token);
        if (user) {
          client.data.user = user;
          if (user.role === 'admin') {
            // Chỉ join room admin-room nếu là admin
            await client.join('admin-room');
            console.log('Admin joined admin room');
          } else {
            // User thường join room cá nhân
            await client.join(`user_${user.user_id}`);
            console.log(`User ${user.user_id} connected to websocket`);
          }
        } else {
        client.disconnect();
      }
      } else {
        // Cho phép kết nối không xác thực (cho admin)
        console.log('Anonymous user connected to websocket');
      }
    } catch (error) {
      console.error('WebSocket connection error:', error);
      client.disconnect();
    }
  }

  afterInit(server: Server) {
    this.websocketService.setServer(server);
  }

  handleDisconnect(client: Socket) {
    const user = client.data.user;
    if (user) {
      console.log(`User ${user.user_id} disconnected from websocket`);
    } else {
      console.log('Anonymous user disconnected from websocket');
    }
  }

  @SubscribeMessage('leave-admin-room')
  handleLeaveAdminRoom(client: Socket) {
    client.leave('admin-room');
    console.log('Admin left admin room');
  }
} 