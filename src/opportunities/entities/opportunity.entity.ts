import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from 'src/auth/entities/user.entity';

export enum OpportunityMethod {
  SIMPLE = 'SIMPLE',
  ADVANCED = 'ADVANCED',
}

export enum OpportunityNeed {
  RENTAL = 'RENTAL',
  BUYER = 'BUYER',
}

export enum OpportunityStatus {
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
  CLOSED = 'CLOSED',
}

@Entity('opportunities')
export class Opportunity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: OpportunityMethod })
  method: OpportunityMethod;

  @Column({ type: 'enum', enum: OpportunityNeed })
  need: OpportunityNeed;

  @Column({ type: 'enum', enum: OpportunityStatus, default: OpportunityStatus.ACTIVE })
  status: OpportunityStatus;

  /** 🔹 SIMPLE only */
  @Column({ type: 'text', nullable: true })
  description?: string;

  /** 🔹 ADVANCED only */
  @Column({ nullable: true })
  location?: string;

  @Column({ nullable: true })
  bedrooms?: number;

  @Column({ nullable: true })
  bathrooms?: number;

  @Column({ type: 'simple-array', nullable: true })
  features?: string[];

  @Column({ type: 'simple-array', nullable: true })
  preferences?: string[];

  @Column({ type: 'json', nullable: true })
  toggles?: Record<string, any>;

  /** 🔹 Optional UI fields */
  @Column({ nullable: true })
  propertyType?: string;

  @Column({ nullable: true })
  price?: number;

  /** 🔹 Relations */
  @ManyToOne(() => User, (user) => user.opportunities, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
