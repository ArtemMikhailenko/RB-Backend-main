import { Test, TestingModule } from '@nestjs/testing';
import { CompanyFollowerController } from './company-follower.controller';

describe('CompanyFollowerController', () => {
  let controller: CompanyFollowerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyFollowerController],
    }).compile();

    controller = module.get<CompanyFollowerController>(CompanyFollowerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
