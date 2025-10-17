import { Test, TestingModule } from '@nestjs/testing';
import { PropertyRentDetailsController } from './property-rent-details.controller';

describe('PropertyRentDetailsController', () => {
  let controller: PropertyRentDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropertyRentDetailsController],
    }).compile();

    controller = module.get<PropertyRentDetailsController>(PropertyRentDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
