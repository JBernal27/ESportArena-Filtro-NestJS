import { Module } from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { TournamentsController } from './tournaments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tournaments } from './entities/tournament.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Match } from 'src/matches/entities/match.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tournaments, User, Match])],
  controllers: [TournamentsController],
  providers: [TournamentsService, UsersService],
})
export class TournamentsModule {}
