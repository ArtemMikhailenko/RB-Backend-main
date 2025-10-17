// src/company-details/entities/company-follower.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Company } from 'src/setting/company-details/entities/company.entity';

@Entity('company_followers')
@Unique(['user', 'company']) // prevent duplicate follows
export class CompanyFollower {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Company, company => company.followers, { onDelete: 'CASCADE' })
  company: Company;

  @CreateDateColumn()
  followedAt: Date;
}
