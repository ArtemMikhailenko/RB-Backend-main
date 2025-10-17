import { Test, TestingModule } from '@nestjs/testing';
import { PropertyRentContactService } from './property-rent-contact.service';

describe('PropertyRentContactService', () => {
  let service: PropertyRentContactService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PropertyRentContactService],
    }).compile();

    service = module.get<PropertyRentContactService>(PropertyRentContactService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
