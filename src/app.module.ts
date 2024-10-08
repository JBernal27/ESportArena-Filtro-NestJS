import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { TournamentsModule } from './tournaments/tournaments.module';
import { MatchesModule } from './matches/matches.module';
import { ScoreboardsModule } from './scoreboards/scoreboards.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    DatabaseModule,
    TournamentsModule,
    MatchesModule,
    ScoreboardsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
