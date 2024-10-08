import { Module } from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { TournamentsController } from './tournaments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tournaments } from './entities/tournament.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Match } from 'src/matches/entities/match.entity';
import { Scoreboard } from 'src/scoreboards/entities/scoreboard.entity';
import { ScoreboardsService } from 'src/scoreboards/scoreboards.service';
import { MatchesService } from 'src/matches/matches.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tournaments, User, Match, Scoreboard])],
  controllers: [TournamentsController],
  providers: [
    TournamentsService,
    UsersService,
    ScoreboardsService,
    MatchesService,
  ],
})
export class TournamentsModule {}
