import { Test, TestingModule } from '@nestjs/testing';
import { PropertyResaleFeaturesService } from './property-resale-features.service';

describe('PropertyResaleFeaturesService', () => {
  let service: PropertyResaleFeaturesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PropertyResaleFeaturesService],
    }).compile();

    service = module.get<PropertyResaleFeaturesService>(PropertyResaleFeaturesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
