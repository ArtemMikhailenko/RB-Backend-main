import { Test, TestingModule } from '@nestjs/testing';
import { CompanyDetailsService } from './company-details.service';

describe('CompanyDetailsService', () => {
  let service: CompanyDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompanyDetailsService],
    }).compile();

    service = module.get<CompanyDetailsService>(CompanyDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
