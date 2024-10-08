import { Test, TestingModule } from '@nestjs/testing';
import { ScoreboardsController } from './scoreboards.controller';
import { ScoreboardsService } from './scoreboards.service';

describe('ScoreboardsController', () => {
  let controller: ScoreboardsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScoreboardsController],
      providers: [ScoreboardsService],
    }).compile();

    controller = module.get<ScoreboardsController>(ScoreboardsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
