import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Tournaments } from 'src/tournaments/entities/tournament.entity';
import { CreateTournamentDto } from 'src/tournaments/dto/create-tournament.dto';
import { User } from 'src/users/entities/user.entity';
import { Scoreboard } from 'src/scoreboards/entities/scoreboard.entity';

export default class CreateTournaments implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(User);
    const tournamentRepository = dataSource.getRepository(Tournaments);
    const scoreboardRepository = dataSource.getRepository(Scoreboard);

    const tournamentsData: CreateTournamentDto[] = [
      {
        name: 'Spring Championship',
        description: 'A tournament to celebrate the arrival of spring.',
        award: 1000,
        users: [1, 2, 3], // IDs of the users participating in this tournament
      },
      {
        name: 'Summer Showdown',
        description: 'The ultimate showdown of skills during summer.',
        award: 1500,
        users: [2, 3, 4, 5],
      },
    ];

    for (const tournamentData of tournamentsData) {
      const tournamentExists = await tournamentRepository.findOneBy({
        name: tournamentData.name,
      });

      if (!tournamentExists) {
        console.log('Añadiendo torneo:', tournamentData.name);

        const newTournament = tournamentRepository.create({
          name: tournamentData.name,
          description: tournamentData.description,
          award: tournamentData.award,
        });
        const savedTournament = await tournamentRepository.save(newTournament);

        for (const userId of tournamentData.users) {
          const user = await userRepository.findOne({
            where: { id: userId },
          });

          if (!user) {
            console.error(
              `User with ID ${userId} not found for tournament: ${tournamentData.name}`,
            );
            continue;
          }

          const scoreboard = scoreboardRepository.create({
            tournament: savedTournament,
            user,
            score: 0,
          });
          await scoreboardRepository.save(scoreboard);

          console.log(
            `Scoreboard creado para el usuario ${userId} en el torneo '${tournamentData.name}'.`,
          );
        }
      }
    }

    console.log('Torneos creados');
  }
}
