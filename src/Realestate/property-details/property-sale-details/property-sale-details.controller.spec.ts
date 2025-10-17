import { Test, TestingModule } from '@nestjs/testing';
import { PropertySaleDetailsController } from './property-sale-details.controller';

describe('PropertySaleDetailsController', () => {
  let controller: PropertySaleDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropertySaleDetailsController],
    }).compile();

    controller = module.get<PropertySaleDetailsController>(PropertySaleDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
