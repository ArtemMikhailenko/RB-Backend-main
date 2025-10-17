import { Test, TestingModule } from '@nestjs/testing';
import { PropertyNewBuildingDetailsService } from './property-new-building-details.service';

describe('PropertyNewBuildingDetailsService', () => {
  let service: PropertyNewBuildingDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PropertyNewBuildingDetailsService],
    }).compile();

    service = module.get<PropertyNewBuildingDetailsService>(PropertyNewBuildingDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
