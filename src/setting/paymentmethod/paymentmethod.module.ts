// src/payment-method/payment-method.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentMethod } from './entities/payment-method.entity';
import { PaymentMethodService } from './paymentmethod.service';
import { PaymentMethodController } from './paymentmethod.controller';
import { User } from 'src/auth/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentMethod, User]), // Entities used here
  ],
  controllers: [PaymentMethodController],
  providers: [PaymentMethodService],
})
export class PaymentmethodModule {}
