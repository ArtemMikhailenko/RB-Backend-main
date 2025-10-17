import { Test, TestingModule } from '@nestjs/testing';
import { PropertyNewBuildingFeaturesService } from './property-new-building-features.service';

describe('PropertyNewBuildingFeaturesService', () => {
  let service: PropertyNewBuildingFeaturesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PropertyNewBuildingFeaturesService],
    }).compile();

    service = module.get<PropertyNewBuildingFeaturesService>(PropertyNewBuildingFeaturesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
