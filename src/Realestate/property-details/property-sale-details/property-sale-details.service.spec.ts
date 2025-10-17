import { Test, TestingModule } from '@nestjs/testing';
import { PropertySaleDetailsService } from './property-sale-details.service';

describe('PropertySaleDetailsService', () => {
  let service: PropertySaleDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PropertySaleDetailsService],
    }).compile();

    service = module.get<PropertySaleDetailsService>(PropertySaleDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
