import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { CompanyMember } from 'src/setting/company-details/entities/company-member.entity';
import { Notification } from 'src/notifications/entities/notification.entity';
import { Opportunity } from 'src/opportunities/entities/opportunity.entity';
import { Property } from 'src/Realestate/property/entities/property.entity';
import { Exclude, Expose } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  password: string | null;

  @Column({nullable:true})
  country: string;

  @Column({ default: false })
  terms: boolean;

  // ✅ NEW: Add provider
  @Column({ type: 'enum', enum: ['local', 'google'], default: 'local' })
  provider: 'local' | 'google';

  // ✅ NEW: Add googleId (nullable)
  @Column({ type: 'varchar', nullable: true, unique: true })
  googleId: string | null;

  @Column({ type: 'text', nullable: true })
  @Exclude()
  profilePic: string | null;
  
  @Expose()
  get profilePicUrl(): string | null {
    if (!this.profilePic) return null;
    return `${process.env.APP_BASE_URL}${this.profilePic}`;
  }

  @OneToMany(() => CompanyMember, (companyMember) => companyMember.user)
  companyMemberships: CompanyMember[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @OneToMany(() => Opportunity, (opportunity) => opportunity.user)
  opportunities: Opportunity[];

   // ✅ One user can have many properties
  @OneToMany(() => Property, (property) => property.user)
  properties: Property[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
