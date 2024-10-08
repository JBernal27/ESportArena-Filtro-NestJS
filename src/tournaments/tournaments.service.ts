import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tournaments } from './entities/tournament.entity';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { ScoreboardsService } from 'src/scoreboards/scoreboards.service';
import { AddUserToTournamentDto } from './dto/add-user.dto';
import { MatchesService } from 'src/matches/matches.service';

@Injectable()
export class TournamentsService {
  constructor(
    @InjectRepository(Tournaments)
    private readonly tournamentsRepository: Repository<Tournaments>,
    private readonly scoreboardsService: ScoreboardsService,
    private readonly matchesService: MatchesService,
  ) {}
  async create(createTournamentDto: CreateTournamentDto) {
    const tournament = this.tournamentsRepository.create({
      ...createTournamentDto,
    });

    const savedTournament = await this.tournamentsRepository.save(tournament);

    if (createTournamentDto.users && createTournamentDto.users.length > 0) {
      const scoreboardDto = {
        tournamentId: savedTournament.id,
        users: createTournamentDto.users,
      };

      await this.scoreboardsService.create(scoreboardDto);
    }

    return this.tournamentsRepository.findOne({
      where: { id: savedTournament.id },
      relations: ['scoreboards'],
    });
  }

  async findAll(
    tournamentId?: number,
    minScore?: number,
    paginationOptions?: { page: number; limit: number },
  ) {
    const { page = 1, limit = 10 } = paginationOptions || {};

    const query = this.tournamentsRepository
      .createQueryBuilder('tournament')
      .leftJoinAndSelect('tournament.scoreboards', 'scoreboard')
      .where('tournament.is_deleted = false');

    if (tournamentId) {
      query.andWhere('tournament.id = :tournamentId', { tournamentId });
    }

    if (minScore) {
      query.andWhere('scoreboard.score >= :minScore', { minScore });
    }

    query.orderBy('scoreboard.score', 'DESC');

    query.skip((page - 1) * limit).take(limit);
    return await query.getMany();
  }

  async findOne(id: number) {
    const tournament = await this.tournamentsRepository.findOne({
      where: { id: id, is_deleted: false },
      relations: ['scoreboards'],
    });

    if (!tournament) {
      throw new NotFoundException(`Tournament with ID ${id} not found`);
    }

    return tournament;
  }

  async update(id: number, updateTournamentDto: UpdateTournamentDto) {
    const tournament = await this.tournamentsRepository.findOne({
      where: { id: id, is_deleted: false },
      relations: ['scoreboards', 'scoreboards.users'],
    });
    if (!tournament) {
      throw new NotFoundException(`Tournament with ID ${id} not found`);
    }
    Object.assign(tournament, updateTournamentDto);
    return await this.tournamentsRepository.save(tournament);
  }

  async remove(id: number) {
    const tournament = await this.tournamentsRepository.findOne({
      where: { id: id },
    });
    if (!tournament) {
      throw new NotFoundException(`Tournament with ID ${id} not found`);
    }
    tournament.is_deleted = true;
    await this.tournamentsRepository.save(tournament);
  }

  async addUserToTournament(
    tournamentId: number,
    addUserDto: AddUserToTournamentDto,
  ) {
    const tournament = await this.tournamentsRepository.findOne({
      where: { id: tournamentId },
    });

    if (!tournament) {
      throw new NotFoundException(
        `Tournament with ID ${tournamentId} not found`,
      );
    }

    const scoreboard = await this.scoreboardsService.addUserToScoreboard(
      tournamentId,
      addUserDto,
    );
    return scoreboard;
  }

  async findByTournamentAndMinScore(tournamentId: number, minScore: number) {
    console.log('tournament:', tournamentId);
    console.log('minScore:', minScore);

    return await this.tournamentsRepository.find({
      where: {
        id: tournamentId,
        scoreboards: {
          score: MoreThanOrEqual(minScore),
        },
      },
      relations: ['scoreboards'],
    });
  }

  async automatch(tournamentId: number) {
    const scoreboards =
      await this.scoreboardsService.findByTournament(tournamentId);

    const players = scoreboards.map((scoreboard) => scoreboard.user);

    if (players.length % 2 !== 0) {
      throw new BadRequestException(
        'The number of players must be even to generate matches',
      );
    }

    const shuffledPlayers = this.shufflePlayers(players);

    const matches = [];

    for (let i = 0; i < shuffledPlayers.length; i += 2) {
      const player1 = shuffledPlayers[i];
      const player2 = shuffledPlayers[i + 1];

      const match = {
        tournament: tournamentId,
        player1: player1.id,
        player2: player2.id,
      };

      await this.matchesService.create(match);
      matches.push(match);
    }

    return matches;
  }

  private shufflePlayers(players: any[]): any[] {
    for (let i = players.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [players[i], players[j]] = [players[j], players[i]];
    }
    return players;
  }
}
