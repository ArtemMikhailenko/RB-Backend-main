import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Company } from './company.entity';
import { User } from 'src/auth/entities/user.entity';

export enum CompanyRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
}

@Entity('company_members')
export class CompanyMember {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Company, (company) => company.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column()
  companyId: number; // Explicit FK column

  @ManyToOne(() => User, (user) => user.companyMemberships, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  userId: number; // Explicit FK column

  @Column({
    type: 'enum',
    enum: CompanyRole,
    default: CompanyRole.MEMBER,
  })
  role: CompanyRole;
}
