import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfigService } from './connection-db.config';
import CreateUsers from './seeders/users.seed';
import { DataSource } from 'typeorm';
import CreateTournaments from './seeders/tournaments.seed';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfigService,
    }),
  ],
  providers: [DatabaseConfigService],
  exports: [DatabaseConfigService],
})
export class DatabaseModule implements OnModuleInit {
  constructor(private readonly dataSource: DataSource) {}
  async onModuleInit() {
    const userSeeders = new CreateUsers();
    await userSeeders.run(this.dataSource);

    const tournamentSeeders = new CreateTournaments();
    await tournamentSeeders.run(this.dataSource);

    console.log('The Database module starts correctly');
  }
}
