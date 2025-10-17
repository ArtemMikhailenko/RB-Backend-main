import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/auth/entities/user.entity';

@Entity('user_profiles')
export class UserProfile {
  @PrimaryGeneratedColumn()
  id: number;

  // One-to-one relation with User entity
  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userid' })
  user: User;

  // Foreign key column for user relation
  @Column({ name: 'userid', nullable: false })
  userId: number;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  language: string;

  @Column({ nullable: true })
  timezone: string;

  @Column({ nullable: true })
  linkedIn: string;

  @Column({ nullable: true })
  twitter: string;

  @Column({ nullable: true })
  facebook: string;

  @Column({ nullable: true })
  instagram: string;

  @Column({ nullable: true })
  tiktok: string;

  @Column({ nullable: true })
  whatsapp: string;

  @Column({ nullable: true })
  viber: string;

  @Column({ nullable: true })
  telegram: string;
}
