import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Tournaments } from 'src/tournaments/entities/tournament.entity';
import { CreateTournamentDto } from 'src/tournaments/dto/create-tournament.dto';
import { UsersService } from 'src/users/users.service';

export default class CreateTournaments implements Seeder {
  private userService: UsersService;

  constructor(userService: UsersService) {
    this.userService = userService;
  }

  public async run(dataSource: DataSource): Promise<void> {
    const tournamentRepository = dataSource.getRepository(Tournaments);

    const tournamentsData: CreateTournamentDto[] = [
      {
        name: 'Spring Championship',
        description: 'A tournament to celebrate the arrival of spring.',
        award: 1000,
        users: [1, 2, 3],
      },
      {
        name: 'Summer Showdown',
        description: 'The ultimate showdown of skills during summer.',
        award: 1500,
        users: [2, 3, 4, 5],
      },
    ];

    for (const tournament of tournamentsData) {
      const tournamentExists = await tournamentRepository.findOneBy({
        name: tournament.name,
      });

      if (!tournamentExists) {
        console.log('Añadiendo torneo:', tournament.name);

        const users = await Promise.all(
          tournament.users.map(async (userId) => {
            const user = await this.userService.findOne(userId);
            if (!user) {
              console.error(
                `User with ID ${userId} not found for tournament: ${tournament.name}`,
              );
              return null;
            }
            return user;
          }),
        );

        const validUsers = users.filter((user) => user !== null);

        if (validUsers.length === tournament.users.length) {
          const newTournament = tournamentRepository.create({
            ...tournament,
            users: validUsers,
          });
          await tournamentRepository.save(newTournament);
        } else {
          console.error(
            `Not all users found for tournament: ${tournament.name}`,
          );
        }
      }
    }

    console.log('Torneos creados');
  }
}
