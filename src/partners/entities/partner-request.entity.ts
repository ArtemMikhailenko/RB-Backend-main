import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { User } from 'src/auth/entities/user.entity';

export enum PartnerRequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

@Entity('partner_requests')
@Index(['sender', 'receiver'])
export class PartnerRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: false, onDelete: 'CASCADE' })
  sender: User;

  @ManyToOne(() => User, { eager: false, onDelete: 'CASCADE' })
  receiver: User;

  @Column({
    type: 'enum',
    enum: PartnerRequestStatus,
    default: PartnerRequestStatus.PENDING,
  })
  status: PartnerRequestStatus;

  @Column({ type: 'varchar', length: 255, nullable: true })
  note?: string; // optional message when sending request

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

