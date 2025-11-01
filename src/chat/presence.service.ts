import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatPresenceService {
  // userId -> set of socketIds
  private online = new Map<number, Set<string>>();

  add(userId: number, socketId: string) {
    if (!this.online.has(userId)) this.online.set(userId, new Set());
    this.online.get(userId)!.add(socketId);
  }

  removeBySocket(socketId: string) {
    for (const [uid, set] of this.online.entries()) {
      if (set.delete(socketId)) {
        if (set.size === 0) this.online.delete(uid);
        break;
      }
    }
  }

  getOnlineUserIds(): number[] {
    return Array.from(this.online.keys());
  }

  getSockets(userId: number): string[] {
    return Array.from(this.online.get(userId) || []);
  }

  isOnline(userId: number) {
    return this.online.has(userId);
  }
}
