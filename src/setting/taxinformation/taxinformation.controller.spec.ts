import { Test, TestingModule } from '@nestjs/testing';
import { TaxinformationController } from './taxinformation.controller';

describe('TaxinformationController', () => {
  let controller: TaxinformationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaxinformationController],
    }).compile();

    controller = module.get<TaxinformationController>(TaxinformationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
