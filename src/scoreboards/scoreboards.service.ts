import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Scoreboard } from './entities/scoreboard.entity';
import { In, Repository } from 'typeorm';
import { CreateScoreboardDto } from './dto/create-scoreboard.dto';
import { User } from 'src/users/entities/user.entity';
import { Tournaments } from 'src/tournaments/entities/tournament.entity';
import { UpdateScoreboardDto } from './dto/update-scoreboard.dto';
import { AddUserToTournamentDto } from 'src/tournaments/dto/add-user.dto';

@Injectable()
export class ScoreboardsService {
  constructor(
    @InjectRepository(Scoreboard)
    private readonly scoreboardRepository: Repository<Scoreboard>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Tournaments)
    private readonly tournamentRepository: Repository<Tournaments>,
  ) {}

  async create(
    createScoreboardDto: CreateScoreboardDto,
  ): Promise<Scoreboard[]> {
    const tournament = await this.tournamentRepository.findOne({
      where: { id: createScoreboardDto.tournamentId },
    });

    if (!tournament) {
      throw new NotFoundException('Tournament not found');
    }

    const users = await this.userRepository.find({
      where: { id: In(createScoreboardDto.users) },
    });

    if (users.length !== createScoreboardDto.users.length) {
      throw new NotFoundException('One or more users not found');
    }

    const scoreboards = users.map((user) =>
      this.scoreboardRepository.create({
        tournament,
        user,
        score: 0,
      }),
    );

    return this.scoreboardRepository.save(scoreboards);
  }

  async findAll(): Promise<Scoreboard[]> {
    return this.scoreboardRepository.find({
      relations: ['user', 'tournament'],
      order: {
        score: 'ASC',
      },
    });
  }

  async findOne(id: number) {
    const scoreboard = await this.scoreboardRepository.findOne({
      where: { id },
      relations: ['user', 'tournament'],
    });

    if (!scoreboard) {
      throw new NotFoundException(`Scoreboard with ID ${id} not found`);
    }

    return scoreboard;
  }

  async update(
    tournamentId: number,
    updateScoreboardDto: UpdateScoreboardDto,
  ): Promise<Scoreboard> {
    const { userId, pointsToAdd } = updateScoreboardDto;

    const scoreboard = await this.scoreboardRepository.findOne({
      where: {
        user: { id: userId },
        tournament: { id: tournamentId },
      },
      relations: ['user', 'tournament'],
    });

    if (!scoreboard) {
      throw new NotFoundException(
        `Scoreboard not found for User ID ${userId} and Tournament ID ${tournamentId}`,
      );
    }

    scoreboard.score += pointsToAdd;

    return this.scoreboardRepository.save(scoreboard);
  }

  async remove(id: number): Promise<void> {
    const scoreboard = await this.findOne(id);
    await this.scoreboardRepository.remove(scoreboard);
  }

  async findByTournament(tournamentId: number): Promise<Scoreboard[]> {
    return this.scoreboardRepository.find({
      where: { tournament: { id: tournamentId } },
      relations: ['user'],
    });
  }

  async addUserToScoreboard(
    tournamentId: number,
    addUserDto: AddUserToTournamentDto,
  ): Promise<Scoreboard> {
    const user = await this.userRepository.findOne({
      where: { id: addUserDto.userId },
    });

    if (!user) {
      throw new NotFoundException(
        `User with ID ${addUserDto.userId} not found`,
      );
    }

    let scoreboard = await this.scoreboardRepository.findOne({
      where: { tournament: { id: tournamentId }, user: { id: user.id } },
    });

    if (!scoreboard) {
      scoreboard = this.scoreboardRepository.create({
        tournament: { id: tournamentId },
        user,
        score: 0,
      });
      await this.scoreboardRepository.save(scoreboard);
    }

    return scoreboard;
  }
}
