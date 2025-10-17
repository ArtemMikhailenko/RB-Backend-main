import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || '*',
  },
})
export class PartnerGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private onlineUsers = new Map<number, string>(); // userId -> socketId

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    for (const [userId, socketId] of this.onlineUsers.entries()) {
      if (socketId === client.id) {
        this.onlineUsers.delete(userId);
        break;
      }
    }
  }

  // User joins with their ID
  @SubscribeMessage('register')
  handleRegister(
    @MessageBody() userId: number,
    @ConnectedSocket() client: Socket,
  ) {
    this.onlineUsers.set(userId, client.id);
    console.log(`User ${userId} registered with socket ${client.id}`);
  }

  // Send partner request notification
  sendPartnerRequestNotification(receiverId: number, payload: any) {
    const socketId = this.onlineUsers.get(receiverId);
    if (socketId) {
      this.server.to(socketId).emit('partnerRequestNotification', payload);
    }
  }
// Remove the old sendNotification
  sendNotification(receiverId: number, payload: any) {
    const socketId = this.onlineUsers.get(receiverId);
    if (socketId) {
      this.server.to(socketId).emit('notification', payload);
    } else {
      console.log(`No active socket for user ID ${receiverId}`);
    }
  }

}
