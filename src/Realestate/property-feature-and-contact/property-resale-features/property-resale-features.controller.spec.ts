import { Test, TestingModule } from '@nestjs/testing';
import { PropertyResaleFeaturesController } from './property-resale-features.controller';

describe('PropertyResaleFeaturesController', () => {
  let controller: PropertyResaleFeaturesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropertyResaleFeaturesController],
    }).compile();

    controller = module.get<PropertyResaleFeaturesController>(PropertyResaleFeaturesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
