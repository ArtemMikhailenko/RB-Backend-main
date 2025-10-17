import { Test, TestingModule } from '@nestjs/testing';
import { PropertyLocationController } from './property-location.controller';

describe('PropertyLocationController', () => {
  let controller: PropertyLocationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropertyLocationController],
    }).compile();

    controller = module.get<PropertyLocationController>(PropertyLocationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
