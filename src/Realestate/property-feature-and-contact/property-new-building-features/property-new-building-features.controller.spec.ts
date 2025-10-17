import { Test, TestingModule } from '@nestjs/testing';
import { PropertyNewBuildingFeaturesController } from './property-new-building-features.controller';

describe('PropertyNewBuildingFeaturesController', () => {
  let controller: PropertyNewBuildingFeaturesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropertyNewBuildingFeaturesController],
    }).compile();

    controller = module.get<PropertyNewBuildingFeaturesController>(PropertyNewBuildingFeaturesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
