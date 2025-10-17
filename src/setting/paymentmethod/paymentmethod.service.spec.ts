import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentMethod } from './entities/payment-method.entity';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class PaymentMethodService {
  constructor(
    @InjectRepository(PaymentMethod)
    private paymentMethodRepository: Repository<PaymentMethod>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(userId: number, dto: CreatePaymentMethodDto): Promise<PaymentMethod> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const paymentMethod = this.paymentMethodRepository.create({
      ...dto,
      user,
    });

    return await this.paymentMethodRepository.save(paymentMethod);
  }

  async findAllByUser(userId: number): Promise<PaymentMethod[]> {
    return await this.paymentMethodRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async findOneByUser(userId: number, id: number): Promise<PaymentMethod> {
    const method = await this.paymentMethodRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!method) throw new NotFoundException('Payment method not found');
    return method;
  }

  async update(userId: number, id: number, dto: UpdatePaymentMethodDto): Promise<PaymentMethod> {
    const method = await this.findOneByUser(userId, id);
    Object.assign(method, dto);
    return await this.paymentMethodRepository.save(method);
  }

  async remove(userId: number, id: number): Promise<void> {
    const method = await this.findOneByUser(userId, id);
    await this.paymentMethodRepository.remove(method);
  }
}
