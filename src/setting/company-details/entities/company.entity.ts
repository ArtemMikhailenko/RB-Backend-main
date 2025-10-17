// src/company-details/entities/company.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { CompanyMember } from './company-member.entity';
import { CompanyInvite } from './company-invite.entity';
import { CompanyFollower } from 'src/company-follower/entities/company-follower.entity';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  // Ensure ONE company per user:
  @Index('UQ_companies_userId', { unique: true })
  @Column({ nullable: false })
  userId: number;

  @Column({ nullable: true })
  companyName: string;

  @Column({ nullable: true })
  industry: string;

  @Column({ nullable: true })
  companyLogo: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  officeUrlName: string;

  @Column({ nullable: true })
  contactEmail: string;

  @Column({ nullable: true })
  addressLine1: string;

  @Column({ nullable: true })
  addressLine2: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  zipCode: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  companySize: string;

  @Column({ nullable: true })
  yearFounded: string;

  @Column({ type: 'text', nullable: true })
  history: string;

  @Column({ type: 'simple-array', nullable: true })
  facts: string[];

  @Column({ nullable: true })
  presentationVideo: string;

  @Column({ nullable: true })
  banner: string;

  @Column({ default: false })
  showOfficeAddress: boolean;

  @Column({ default: false })
  showPostsInFeed: boolean;

  @Column({ default: false })
  hideFromPartners: boolean;

  @Column({ type: 'simple-array', nullable: true })
  languages: string[];

  // NEW: relations for members & invites
  @OneToMany(() => CompanyMember, m => m.company)
  members: CompanyMember[];

  @OneToMany(() => CompanyInvite, i => i.company)
  invites: CompanyInvite[];

  @OneToMany(() => CompanyFollower, f => f.company)
followers: CompanyFollower[];


  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
