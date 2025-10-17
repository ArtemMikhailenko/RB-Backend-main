import { Test, TestingModule } from '@nestjs/testing';
import { PropertyRentContactController } from './property-rent-contact.controller';

describe('PropertyRentContactController', () => {
  let controller: PropertyRentContactController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropertyRentContactController],
    }).compile();

    controller = module.get<PropertyRentContactController>(PropertyRentContactController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
