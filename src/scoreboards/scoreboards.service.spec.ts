import { Test, TestingModule } from '@nestjs/testing';
import { ScoreboardsService } from './scoreboards.service';

describe('ScoreboardsService', () => {
  let service: ScoreboardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScoreboardsService],
    }).compile();

    service = module.get<ScoreboardsService>(ScoreboardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
