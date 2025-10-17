import { Test, TestingModule } from '@nestjs/testing';
import { PropertyNewBuildingDetailsController } from './property-new-building-details.controller';

describe('PropertyNewBuildingDetailsController', () => {
  let controller: PropertyNewBuildingDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropertyNewBuildingDetailsController],
    }).compile();

    controller = module.get<PropertyNewBuildingDetailsController>(PropertyNewBuildingDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
