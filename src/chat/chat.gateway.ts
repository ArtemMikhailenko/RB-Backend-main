import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ChatPresenceService } from './presence.service';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  },
})
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly jwt: JwtService,
    private readonly presence: ChatPresenceService,
    private readonly chat: ChatService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token =
        (client.handshake.auth && (client.handshake.auth as any).token) ||
        (client.handshake.headers['authorization']
          ? String(client.handshake.headers['authorization']).split(' ')[1]
          : undefined) ||
        (client.handshake.query && (client.handshake.query as any).token);

      if (!token) {
        client.disconnect(true);
        return;
      }
      const payload: any = await this.jwt.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      const userId = payload.sub || payload.id;
      if (!userId) throw new Error('No sub in token');
      (client.data as any).userId = Number(userId);
      this.presence.add(Number(userId), client.id);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Socket auth failed:', e?.message || e);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    this.presence.removeBySocket(client.id);
  }

  @SubscribeMessage('chat:message')
  async onMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    body: { toUserId: number; text: string; clientId?: string },
  ) {
    const fromUserId = (client.data as any).userId as number;
    if (!fromUserId || !body?.toUserId || !body?.text) return;
    const saved = await this.chat.createMessage(
      fromUserId,
      Number(body.toUserId),
      String(body.text).slice(0, 4000),
    );
    // emit to sender (echo with DB id/ts)
    this.server.to(client.id).emit('chat:message', saved);
    // emit to receiver if online
    for (const sid of this.presence.getSockets(Number(body.toUserId))) {
      this.server.to(sid).emit('chat:message', saved);
    }
  }

  @SubscribeMessage('chat:typing')
  onTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { toUserId: number },
  ) {
    const fromUserId = (client.data as any).userId as number;
    if (!fromUserId || !body?.toUserId) return;
    for (const sid of this.presence.getSockets(Number(body.toUserId))) {
      this.server.to(sid).emit('chat:typing', { fromUserId });
    }
  }

  @SubscribeMessage('chat:read')
  async onRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { peerId: number; upTo?: string },
  ) {
    const me = (client.data as any).userId as number;
    if (!me || !body?.peerId) return;
    const upTo = body.upTo ? new Date(body.upTo) : undefined;
    await this.chat.markRead(me, Number(body.peerId), upTo);
    // notify peer that their messages were read by me
    for (const sid of this.presence.getSockets(Number(body.peerId))) {
      this.server
        .to(sid)
        .emit('chat:read', { fromUserId: me, toUserId: Number(body.peerId), upTo });
    }
  }
}
