import { Test, TestingModule } from '@nestjs/testing';
import { TaxinformationService } from './taxinformation.service';

describe('TaxinformationService', () => {
  let service: TaxinformationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaxinformationService],
    }).compile();

    service = module.get<TaxinformationService>(TaxinformationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
