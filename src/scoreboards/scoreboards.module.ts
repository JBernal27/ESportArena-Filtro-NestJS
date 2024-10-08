import { Module } from '@nestjs/common';
import { ScoreboardsService } from './scoreboards.service';
import { ScoreboardsController } from './scoreboards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Scoreboard } from './entities/scoreboard.entity';
import { User } from 'src/users/entities/user.entity';
import { Tournaments } from 'src/tournaments/entities/tournament.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Scoreboard, User, Tournaments])],
  controllers: [ScoreboardsController],
  providers: [ScoreboardsService],
})
export class ScoreboardsModule {}
