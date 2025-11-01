import {
  Controller,
  Get,
  Query,
  UseGuards,
  Req,
  Post,
  Body,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ChatService } from './chat.service';
import { ChatPresenceService } from './presence.service';
import { Request } from 'express';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

class HistoryQueryDto {
  @Type(() => Number)
  @IsInt()
  peerId!: number;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(0)
  offset?: number = 0;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 50;
}

class MarkReadDto {
  @Type(() => Number)
  @IsInt()
  peerId!: number;

  @IsOptional()
  @IsString()
  upTo?: string; // ISO date string
}

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(
    private readonly chat: ChatService,
    private readonly presence: ChatPresenceService,
  ) {}

  @Get('users')
  async users(@Req() req: Request) {
    const me = (req as any).user?.id as number;
    const users = await this.chat.listUsers(me);
    const lastByPeer = await this.chat.getLastMessagesByPeer(me);
    return users.map((u) => ({
      id: u.id,
      name: `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim(),
      email: u.email,
      avatarUrl: (u as any).profilePicUrl ?? null,
      online: this.presence.isOnline(u.id),
      lastMessage: lastByPeer.get(u.id) || null,
    }));
  }

  @Get('history')
  async history(@Req() req: Request, @Query() q: HistoryQueryDto) {
    const me = (req as any).user?.id as number;
    const items = await this.chat.getHistory(me, q.peerId, q.offset, q.limit);
    return { items };
  }

  @Post('mark-read')
  async markRead(@Req() req: Request, @Body() body: MarkReadDto) {
    const me = (req as any).user?.id as number;
    const upTo = body.upTo ? new Date(body.upTo) : undefined;
    const updated = await this.chat.markRead(me, body.peerId, upTo);
    return { updated };
  }
}
