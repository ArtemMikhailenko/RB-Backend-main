import { Test, TestingModule } from '@nestjs/testing';
import { PaymentmethodController } from './paymentmethod.controller';

describe('PaymentmethodController', () => {
  let controller: PaymentmethodController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentmethodController],
    }).compile();

    controller = module.get<PaymentmethodController>(PaymentmethodController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
