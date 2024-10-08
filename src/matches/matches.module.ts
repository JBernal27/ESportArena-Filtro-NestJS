import { Module } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';
import { User } from 'src/users/entities/user.entity';
import { Tournaments } from 'src/tournaments/entities/tournament.entity';
import { UsersService } from 'src/users/users.service';
import { TournamentsService } from 'src/tournaments/tournaments.service';
import { Scoreboard } from 'src/scoreboards/entities/scoreboard.entity';
import { ScoreboardsService } from 'src/scoreboards/scoreboards.service';

@Module({
  imports: [TypeOrmModule.forFeature([Match, User, Tournaments, Scoreboard])],
  controllers: [MatchesController],
  providers: [
    MatchesService,
    UsersService,
    TournamentsService,
    ScoreboardsService,
  ],
})
export class MatchesModule {}
