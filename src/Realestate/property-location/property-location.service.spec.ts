import { Test, TestingModule } from '@nestjs/testing';
import { PropertyLocationService } from './property-location.service';

describe('PropertyLocationService', () => {
  let service: PropertyLocationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PropertyLocationService],
    }).compile();

    service = module.get<PropertyLocationService>(PropertyLocationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
