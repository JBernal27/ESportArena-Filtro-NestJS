import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfigService } from './connection-db.config';
import CreateUsers from './seeders/users.seed';
import { DataSource } from 'typeorm';

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
    const roleSeeders = new CreateUsers();
    await roleSeeders.run(this.dataSource);

    console.log('The Database module starts correctly');
  }
}
