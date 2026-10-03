import { Test, TestingModule } from '@nestjs/testing';
import { PropertiesController } from './properties.controller.js';
import { PropertiesService } from './properties.service.js';

describe('PropertiesController', () => {
  let controller: PropertiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropertiesController],
      providers: [PropertiesService],
    }).compile();

    controller = module.get<PropertiesController>(PropertiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
