import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { Repository } from 'typeorm';
import { Match } from './entities/match.entity';
import { TournamentsService } from 'src/tournaments/tournaments.service';
import { UsersService } from 'src/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { MatchResultDto } from './dto/post-match-result.dto';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private readonly matchesRepository: Repository<Match>,
    private readonly tournamentService: TournamentsService,
    private readonly userService: UsersService,
  ) {}

  async create(createMatchDto: CreateMatchDto) {
    const player1Exists = await this.userService.findOne(
      createMatchDto.player1,
    );
    const player2Exists = await this.userService.findOne(
      createMatchDto.player2,
    );

    if (!player1Exists) {
      throw new NotFoundException(
        `Player1 with ID ${createMatchDto.player1} does not exist.`,
      );
    }
    if (!player2Exists) {
      throw new NotFoundException(
        `Player2 with ID ${createMatchDto.player2} does not exist.`,
      );
    }

    const tournament = await this.tournamentService.findOne(
      createMatchDto.tournament,
    );

    if (!tournament) {
      throw new NotFoundException(
        `Tournament with ID ${createMatchDto.tournament} does not exist.`,
      );
    }

    const isPlayer1InTournament = tournament.users.some(
      (player) => player.id === createMatchDto.player1,
    );
    const isPlayer2InTournament = tournament.users.some(
      (player) => player.id === createMatchDto.player2,
    );

    if (!isPlayer1InTournament) {
      throw new BadRequestException(
        `Player with ID ${createMatchDto.player1} is not registered in the tournament.`,
      );
    }
    if (!isPlayer2InTournament) {
      throw new BadRequestException(
        `Player with ID ${createMatchDto.player2} is not registered in the tournament.`,
      );
    }

    const match = this.matchesRepository.create({
      player1: player1Exists,
      player2: player2Exists,
      tournament: tournament,
    });

    return await this.matchesRepository.save(match);
  }

  async findAll() {
    return await this.matchesRepository.find({
      where: { is_deleted: false },
      relations: ['tournaments'],
    });
  }

  async findOne(id: number) {
    const match = await this.matchesRepository.findOne({
      where: { id: id, is_deleted: false },
      relations: ['tournaments'],
    });

    if (!match) {
      throw new NotFoundException(`Match with ID ${id} not found`);
    }

    return match;
  }

  async update(id: number, updateMatchDto: UpdateMatchDto) {
    const match = await this.matchesRepository.findOne({
      where: { id: id, is_deleted: false },
      relations: ['tournaments'],
    });
    if (!match) {
      throw new NotFoundException(`Match with ID ${id} not found`);
    }
    Object.assign(match, updateMatchDto);
    return await this.matchesRepository.save(match);
  }

  async remove(id: number) {
    const match = await this.matchesRepository.findOne({
      where: { id: id },
    });
    if (!match) {
      throw new NotFoundException(`Match with ID ${id} not found`);
    }
    match.is_deleted = true;
    await this.matchesRepository.save(match);
  }

  async updateMatchResults(id: number, matchResultDto: MatchResultDto) {
    const match = await this.matchesRepository.findOne({
      where: { id: id, is_deleted: false },
      relations: ['users'],
    });

    if (!match) {
      throw new NotFoundException(`Match with ID ${id} not found.`);
    }

    match.player1Result = matchResultDto.player1Result ?? match.player1Result;
    match.player2Result = matchResultDto.player2Result ?? match.player2Result;
    match.totalTime = matchResultDto.totalTime ?? match.totalTime;

    return await this.matchesRepository.save(match);
  }
}
