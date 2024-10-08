import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tournaments } from './entities/tournament.entity';
import { Repository } from 'typeorm';
import { ScoreboardsService } from 'src/scoreboards/scoreboards.service';
import { AddUserToTournamentDto } from './dto/add-user.dto';

@Injectable()
export class TournamentsService {
  constructor(
    @InjectRepository(Tournaments)
    private readonly tournamentsRepository: Repository<Tournaments>,
    private readonly scoreboardsService: ScoreboardsService,
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

  async findAll() {
    return await this.tournamentsRepository
      .createQueryBuilder('tournament')
      .leftJoinAndSelect('tournament.scoreboards', 'scoreboard')
      .where('tournament.is_deleted = false')
      .orderBy('scoreboard.score', 'DESC') // Cambia a DESC para que los puntajes más altos aparezcan primero
      .getMany();
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
}
