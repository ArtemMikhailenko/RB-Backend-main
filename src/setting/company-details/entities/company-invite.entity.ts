// src/company-invites/entities/company-invite.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
  CreateDateColumn,
} from 'typeorm';
import { Company } from 'src/setting/company-details/entities/company.entity';
import { User } from 'src/auth/entities/user.entity';
import { CompanyRole } from './company-member.entity';

export type InviteStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED' | 'CANCELED';

@Entity('company_invites')
@Unique(['companyId', 'invitedEmail', 'status']) // ensures only one PENDING per email/company
export class CompanyInvite {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Company, c => c.invites, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @Column()
  companyId: number;

  @Column()
  invitedEmail: string;

  @Column({ type: 'enum', enum: ['OWNER', 'ADMIN', 'MEMBER', 'VIEWER'] })
  role: CompanyRole;

  @Column()
  token: string; // store a random token (consider hashing later)

  @Column({
    type: 'enum',
    enum: ['PENDING', 'ACCEPTED', 'DECLINED', 'EXPIRED', 'CANCELED'],
    default: 'PENDING',
  })
  status: InviteStatus;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'invitedByUserId' })
  invitedBy: User;

  @Column()
  invitedByUserId: number;

  @CreateDateColumn()
  createdAt: Date;
}
