import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/auth/entities/user.entity';

@Entity()
export class NotificationPreference {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true })
  user: User;

  @Column({ default: false })
  emailNewMessages: boolean;

  @Column({ default: false })
  emailTeamUpdates: boolean;

  @Column({ default: false })
  emailBillingAlerts: boolean;

  @Column({ default: false })
  emailMarketing: boolean;

  @Column({ default: false })
  pushEnable: boolean;

  @Column({ default: false })
  pushNewMessages: boolean;

  @Column({ default: false })
  pushTeamActivity: boolean;

  @Column({ default: false })
  smsSecurityAlerts: boolean;

  @Column({ default: false })
  smsAccountUpdates: boolean;

  @Column({ default: false })
  inAppSoundAlerts: boolean;

  @Column({ default: false })
  inAppBadgeCounter: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
