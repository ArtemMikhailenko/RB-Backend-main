import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import {
  PartnerRequest,
  PartnerRequestStatus,
} from './entities/partner-request.entity';
import { User } from 'src/auth/entities/user.entity';
import { SendPartnerRequestDto } from './dtos/send-partner-request.dto';
import { PartnerGateway } from './partner.gateway';
import { NotificationService } from 'src/notifications/notifications.service';
import { Partner, PartnerStatus } from './entities/partner.entity';

@Injectable()
export class PartnersService {
  constructor(
    @InjectRepository(PartnerRequest)
    private readonly partnerReqRepo: Repository<PartnerRequest>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly partnerGateway: PartnerGateway,
    private readonly notificationService: NotificationService,
    @InjectRepository(Partner)
    private readonly partnerRepo: Repository<Partner>,
  ) {}

async getMyPartners(userId: number, page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  // 1️⃣ Find all partner connections for this user
  const [partners, total] = await this.partnerRepo.findAndCount({
    where: [{ user: { id: userId } }, { partner: { id: userId } }],
    relations: ['user', 'partner'],
    skip,
    take: limit,
    order: { createdAt: 'DESC' },
  });

  // 2️⃣ Get my partner IDs
  const myPartnerIds = partners.map((p) =>
    p.user.id === userId ? p.partner.id : p.user.id,
  );

  // 3️⃣ Count mutuals for each partner
  const mutualsMap: Record<number, number> = {}; // partnerId -> mutual count
  if (myPartnerIds.length > 0) {
    const mutuals = await this.partnerRepo
      .createQueryBuilder()
      .select('sub.partnerId', 'partnerId')
      .addSelect('COUNT(*)', 'mutualCount')
      .from((qb) => {
        return qb
          .select(
            'CASE WHEN p.userId IN (:...myPartnerIds) THEN p.partnerId ELSE p.userId END',
            'partnerId',
          )
          .from('partners', 'p')
          .setParameter('myPartnerIds', myPartnerIds)
          .where(
            'p.userId IN (:...myPartnerIds) OR p.partnerId IN (:...myPartnerIds)',
          )
          .andWhere('p.userId != :userId AND p.partnerId != :userId', { userId });
      }, 'sub')
      .groupBy('sub.partnerId')
      .getRawMany();

    mutuals.forEach((m) => {
      mutualsMap[+m.partnerId] = +m.mutualCount;
    });
  }

  // 4️⃣ Normalize partner info
  const result = partners.map((p) => {
    const partnerUser = p.user.id === userId ? p.partner : p.user;
    return {
      id: partnerUser.id,
      name: `${partnerUser.firstName} ${partnerUser.lastName}`,
      email: partnerUser.email,
      profileImage: partnerUser.profilePicUrl ?? null,
      status: p.status,
      connectedAt: p.createdAt,
      mutualCount: mutualsMap[partnerUser.id] ?? 0,
      isMutual: (mutualsMap[partnerUser.id] ?? 0) > 0,
    };
  });

  return {
    data: result,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}


  async sendRequest(
    receiverId: number,
    senderId: number,
    dto: SendPartnerRequestDto,
  ) {
    if (receiverId === senderId) {
      throw new BadRequestException('You cannot send a request to yourself.');
    }

    const sender = await this.userRepo.findOne({ where: { id: senderId } });
    if (!sender) throw new NotFoundException('Sender not found.');

    const receiver = await this.userRepo.findOne({ where: { id: receiverId } });
    if (!receiver) throw new NotFoundException('Receiver not found.');

    // Prevent duplicates if there is already a pending or accepted relationship
    const existing = await this.partnerReqRepo.findOne({
      where: [
        {
          sender: { id: senderId },
          receiver: { id: receiverId },
          status: In([
            PartnerRequestStatus.PENDING,
            PartnerRequestStatus.ACCEPTED,
          ]),
        },
        {
          sender: { id: receiverId },
          receiver: { id: senderId },
          status: In([
            PartnerRequestStatus.PENDING,
            PartnerRequestStatus.ACCEPTED,
          ]),
        },
      ],
      relations: ['sender', 'receiver'],
    });

    if (existing) {
      if (existing.status === PartnerRequestStatus.ACCEPTED) {
        throw new BadRequestException('You are already partners.');
      }
      throw new BadRequestException('A pending request already exists.');
    }

    const request = this.partnerReqRepo.create({
      sender: sender, // ✅ always defined now
      receiver: receiver,
      status: PartnerRequestStatus.PENDING,
      note: dto?.note,
    });

    const savedRequest = await this.partnerReqRepo.save(request);

    // 🔔 Send WebSocket notification to the receiver
    this.partnerGateway.sendPartnerRequestNotification(receiver.id, {
      message: `${sender.firstName} ${sender.lastName}sent you a partner request`,
      senderId: sender.id,
    });
    // 2️⃣ Email notification
    await this.notificationService.sendPartnerRequest(sender, receiver);

    return {
      id: savedRequest.id,
      senderId: savedRequest.sender.id,
      receiverId: savedRequest.receiver.id,
      status: savedRequest.status,
      note: savedRequest.note,
      createdAt: savedRequest.createdAt,
      updatedAt: savedRequest.updatedAt,
    };
  }

  async acceptRequest(requestId: number, receiverId: number): Promise<any> {
    // 1️⃣ Find the request
    const request = await this.partnerReqRepo.findOne({
      where: { id: requestId },
      relations: ['sender', 'receiver'],
    });

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    // 2️⃣ Check authorization
    if (request.receiver.id !== receiverId) {
      throw new BadRequestException(
        'You are not authorized to accept this request',
      );
    }

    // 3️⃣ Only pending requests can be accepted
    if (request.status !== PartnerRequestStatus.PENDING) {
      throw new BadRequestException(`Request is already ${request.status}`);
    }

    // 4️⃣ Update request status
    request.status = PartnerRequestStatus.ACCEPTED;
    await this.partnerReqRepo.save(request);

    // 5️⃣ Insert into Partners table
    await this.partnerRepo.save({
      user: request.sender,
      partner: request.receiver,
      status: PartnerStatus.ACTIVE,
    });

    // 6️⃣ WebSocket notification to the original sender
    this.partnerGateway.sendPartnerRequestNotification(request.sender.id, {
      type: 'partner_request_accepted',
      message: `${request.receiver.firstName} ${request.receiver.lastName} accepted your partner request`,
      senderId: request.receiver.id,
    });

    // 7️⃣ Email notification to the original sender
    await this.notificationService.sendPartnerRequestAccepted(
      request.receiver, // the one who accepted
      request.sender, // original sender
    );
     await this.partnerReqRepo.save(request);
     // ✅ 8️⃣ Delete the request from DB
await this.partnerReqRepo.delete(requestId);

    return {message: 'Partner request accepted'};
  }

  async removePartner(
    userId: number,
    partnerId: number,
  ): Promise<{ message: string }> {
    // 1️⃣ Find the partner connection
    const partnerConnection = await this.partnerRepo.findOne({
      where: [
        { user: { id: userId }, partner: { id: partnerId } },
        { user: { id: partnerId }, partner: { id: userId } },
      ],
      relations: ['user', 'partner'],
    });

    if (!partnerConnection) {
      throw new NotFoundException('Partner connection not found.');
    }

    // 3️⃣ Delete the partner connection silently
    await this.partnerRepo.remove(partnerConnection);

    const relatedRequests = await this.partnerReqRepo.find({
      where: [
        { sender: { id: userId }, receiver: { id: partnerId } },
        { sender: { id: partnerId }, receiver: { id: userId } },
      ],
    });

    if (relatedRequests.length > 0) {
      await this.partnerReqRepo.remove(relatedRequests);
    }

    return { message: 'Partner connection removed successfully.' };
  }

  async getReceivedRequests(userId: number, page = 1, limit = 10) {
  const [data, total] = await this.partnerReqRepo.findAndCount({
    where: { receiver: { id: userId } },
    relations: ['sender'],
    order: { createdAt: 'DESC' },
    skip: (page - 1) * limit,
    take: limit,
  });

  return {
    data: data.map((req) => ({
      id: req.id,
      status: req.status,
      createdAt: req.createdAt,
      sender: {
        id: req.sender.id,
        name: `${req.sender.firstName} ${req.sender.lastName}`,
        profileImage: req.sender.profilePicUrl ?? null,
        email: req.sender.email,
        country: req.sender.country,
      },
    })),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

  async getSuggestions(userId: number, limit = 10) {
    // 1️⃣ Get my partners (direct)
    const myPartners = await this.partnerRepo.find({
      where: [{ user: { id: userId } }, { partner: { id: userId } }],
      relations: ['user', 'partner'],
    });

    const myPartnerIds = myPartners.map((p) =>
      p.user.id === userId ? p.partner.id : p.user.id,
    );

    // 2️⃣ Get pending/previous requests I sent
    const myRequests = await this.partnerReqRepo.find({
      where: [{ sender: { id: userId } }, { receiver: { id: userId } }],
      relations: ['sender', 'receiver'],
    });
    const requestedIds = myRequests.map((r) =>
  r.sender.id === userId ? r.receiver.id : r.sender.id,
);

    // 3️⃣ Find mutual candidates (only if I have partners)
    let mutuals: any[] = [];
    if (myPartnerIds.length > 0) {
      mutuals = await this.partnerRepo
        .createQueryBuilder('p')
        .leftJoin('p.user', 'user')
        .leftJoin('p.partner', 'partner')
        .where('p.userId IN (:...myPartnerIds)', { myPartnerIds })
        .andWhere('p.partnerId != :userId', { userId })
        .andWhere('p.partnerId NOT IN (:...excludedIds)', {
          excludedIds: [...myPartnerIds, ...requestedIds, userId],
        })
        .select('p.partnerId', 'candidateId')
        .addSelect('COUNT(*)', 'mutualCount')
        .groupBy('p.partnerId')
        .orderBy('mutualCount', 'DESC')
        .limit(limit)
        .getRawMany();
    }

    let suggestions: any[] = [];

    // 4️⃣ Attach user info to mutuals
    if (mutuals.length > 0) {
      const users = await this.userRepo.findBy({
        id: In(mutuals.map((m) => +m.candidateId)),
      });

      suggestions = mutuals
        .map((m) => {
          const u = users.find((user) => user.id === +m.candidateId);
          return u
            ? {
                id: u.id,
                name: `${u.firstName} ${u.lastName}`,
                profileImage: u.profilePicUrl ?? null, // ✅ profile included
                mutualCount: +m.mutualCount,
                email: u.email,
                createdat: u.createdAt,
                country: u.country,
                isMutual: true,
              }
            : null;
        })
        .filter(Boolean);
    }

    // 5️⃣ If not enough, add random users
    if (suggestions.length < limit) {
      const extraUsers = await this.userRepo
        .createQueryBuilder('u')
        .where('u.id != :userId', { userId })
        .andWhere('u.id NOT IN (:...excludedIds)', {
          excludedIds: [
            ...myPartnerIds,
            ...requestedIds,
            ...mutuals.map((m) => +m.candidateId),
            userId,
          ],
        })
        .orderBy('RAND()')
        .limit(limit - suggestions.length)
        .getMany();

      suggestions.push(
        ...extraUsers.map((u) => ({
          id: u.id,
          name: `${u.firstName} ${u.lastName}`,
          profileImage: u.profilePicUrl ?? null, // ✅ added profile
          mutualCount: 0,
          email: u.email,
          isMutual: false,
          country: u.country,
          createdat: u.createdAt,
        })),
      );
    }

    return suggestions;
  }

async rejectRequest(requestId: number, receiverId: number) {
  // 1️⃣ Find the request
  const request = await this.partnerReqRepo.findOne({
    where: { id: requestId, receiver: { id: receiverId }, status: PartnerRequestStatus.PENDING },
  });

  if (!request) {
    throw new NotFoundException('Partner request not found or already handled.');
  }

  // 2️⃣ Mark as rejected (or delete if you prefer)
 await this.partnerReqRepo.delete({ id: requestId });

  return { message: 'Partner request rejected successfully.' };
}


}
