import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';

@Entity()
@Unique(['user']) // only one tax info per user
export class TaxInformation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  companyName: string;

  @Column({ nullable: true })
  taxId: string; // Tax ID / VAT Number

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

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
