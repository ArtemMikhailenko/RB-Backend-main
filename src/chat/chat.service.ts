import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message) private readonly msgRepo: Repository<Message>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async listUsers(excludeUserId: number) {
    const users = await this.userRepo.find({
      where: { /* filter below */ },
      select: [
        'id',
        'firstName',
        'lastName',
        'email',
        'profilePic',
      ],
      order: { firstName: 'ASC', lastName: 'ASC' },
    });
    // Exclude current user manually because TypeORM doesn't support simple != in find options
    return users.filter((u) => u.id !== excludeUserId);
  }

  async getLastMessagesByPeer(me: number): Promise<Map<number, Message>> {
    // get all messages that involve me, newest first
    const rows = await this.msgRepo
      .createQueryBuilder('m')
      .where('m.fromUserId = :me OR m.toUserId = :me', { me })
      .orderBy('m.ts', 'DESC')
      .getMany();

    const result = new Map<number, Message>();
    for (const m of rows) {
      const peerId = m.fromUserId === me ? m.toUserId : m.fromUserId;
      if (!result.has(peerId)) result.set(peerId, m);
    }
    return result;
  }

  async getHistory(me: number, peerId: number, offset = 0, limit = 50) {
    const [items] = await this.msgRepo.findAndCount({
      where: [
        { fromUserId: me, toUserId: peerId },
        { fromUserId: peerId, toUserId: me },
      ],
      order: { ts: 'ASC' },
      skip: offset,
      take: limit,
    });
    return items;
  }

  async createMessage(fromUserId: number, toUserId: number, text: string) {
    const m = this.msgRepo.create({ fromUserId, toUserId, text });
    return this.msgRepo.save(m);
  }

  async markRead(me: number, peerId: number, upTo?: Date) {
    const qb = this.msgRepo
      .createQueryBuilder()
      .update(Message)
      .set({ read: true })
      .where('toUserId = :me AND fromUserId = :peerId AND read = false', {
        me,
        peerId,
      });
    if (upTo) qb.andWhere('ts <= :upTo', { upTo });
    const res = await qb.execute();
    return res.affected || 0;
  }
}
