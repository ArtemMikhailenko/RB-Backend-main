import { Test, TestingModule } from '@nestjs/testing';
import { CompanyFollowerService } from './company-follower.service';

describe('CompanyFollowerService', () => {
  let service: CompanyFollowerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompanyFollowerService],
    }).compile();

    service = module.get<CompanyFollowerService>(CompanyFollowerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
