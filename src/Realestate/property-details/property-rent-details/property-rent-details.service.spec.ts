import { Test, TestingModule } from '@nestjs/testing';
import { PropertyRentDetailsService } from './property-rent-details.service';

describe('PropertyRentDetailsService', () => {
  let service: PropertyRentDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PropertyRentDetailsService],
    }).compile();

    service = module.get<PropertyRentDetailsService>(PropertyRentDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
