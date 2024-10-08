import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { Repository } from 'typeorm';
import { Match } from './entities/match.entity';
import { UsersService } from 'src/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { MatchResultDto } from './dto/post-match-result.dto';
import { Scoreboard } from 'src/scoreboards/entities/scoreboard.entity';
import { ScoreboardsService } from 'src/scoreboards/scoreboards.service';
import { Tournaments } from 'src/tournaments/entities/tournament.entity';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private readonly matchesRepository: Repository<Match>,
    @InjectRepository(Tournaments)
    private readonly tournamentRepository: Repository<Tournaments>,
    private readonly userService: UsersService,
    private readonly scoreboardService: ScoreboardsService,
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

    const tournament = await this.tournamentRepository.findOne({
      where: { id: createMatchDto.tournament },
    });

    if (!tournament) {
      throw new NotFoundException(
        `Tournament with ID ${createMatchDto.tournament} does not exist.`,
      );
    }

    const scoreboards: Scoreboard[] =
      await this.scoreboardService.findByTournament(tournament.id);
    if (!scoreboards) {
      throw new NotFoundException('Scoreboard not found for this tournament');
    }

    const isPlayer1InTournament = scoreboards.some(
      (scoreboard) => scoreboard.user.id === createMatchDto.player1,
    );
    const isPlayer2InTournament = scoreboards.some(
      (scoreboard) => scoreboard.user.id === createMatchDto.player2,
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
      relations: ['player1', 'player2', 'tournament'],
    });

    if (!match) {
      throw new NotFoundException(`Match with ID ${id} not found`);
    }

    const previousPlayer1Result = match.player1Result;
    const previousPlayer2Result = match.player2Result;

    const player1Id = match.player1.id;
    const player2Id = match.player2.id;

    if (previousPlayer1Result === previousPlayer2Result) {
      await this.scoreboardService.update(match.tournament.id, {
        userId: player1Id,
        pointsToAdd: -1,
      });
      await this.scoreboardService.update(match.tournament.id, {
        userId: player2Id,
        pointsToAdd: -1,
      });
    } else if (previousPlayer1Result > previousPlayer2Result) {
      await this.scoreboardService.update(match.tournament.id, {
        userId: player1Id,
        pointsToAdd: -3,
      });
    } else {
      await this.scoreboardService.update(match.tournament.id, {
        userId: player2Id,
        pointsToAdd: -3,
      });
    }

    Object.assign(match, updateMatchDto);
    await this.matchesRepository.save(match);

    const updatedPlayer1Result = match.player1Result;
    const updatedPlayer2Result = match.player2Result;

    if (updatedPlayer1Result === updatedPlayer2Result) {
      await this.scoreboardService.update(match.tournament.id, {
        userId: player1Id,
        pointsToAdd: 1,
      });
      await this.scoreboardService.update(match.tournament.id, {
        userId: player2Id,
        pointsToAdd: 1,
      });
    } else if (updatedPlayer1Result > updatedPlayer2Result) {
      await this.scoreboardService.update(match.tournament.id, {
        userId: player1Id,
        pointsToAdd: 3,
      });
    } else {
      await this.scoreboardService.update(match.tournament.id, {
        userId: player2Id,
        pointsToAdd: 3,
      });
    }

    return match;
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
      relations: ['player1', 'player2', 'tournament'],
    });

    if (!match) {
      throw new NotFoundException(`Match with ID ${id} not found.`);
    }

    if (match.player1Result !== null || match.player2Result !== null) {
      throw new ForbiddenException(
        `Match with ID ${id} already has a result, if you need to change contact the administrator`,
      );
    }

    match.player1Result = matchResultDto.player1Result ?? match.player1Result;
    match.player2Result = matchResultDto.player2Result ?? match.player2Result;
    match.totalTime = matchResultDto.totalTime ?? match.totalTime;

    await this.matchesRepository.save(match);

    const player1Id = match.player1.id;
    const player2Id = match.player2.id;

    if (match.player1Result > match.player2Result) {
      await this.scoreboardService.update(match.tournament.id, {
        userId: player1Id,
        pointsToAdd: 3,
      });
    } else if (match.player2Result > match.player1Result) {
      await this.scoreboardService.update(match.tournament.id, {
        userId: player2Id,
        pointsToAdd: 3,
      });
    } else {
      await this.scoreboardService.update(match.tournament.id, {
        userId: player1Id,
        pointsToAdd: 1,
      });
      await this.scoreboardService.update(match.tournament.id, {
        userId: player2Id,
        pointsToAdd: 1,
      });
    }

    return match;
  }

  async findMatchesByTournament(tournamentId: number) {
    const matches = await this.matchesRepository.find({
      where: { tournament: { id: tournamentId } },
      relations: ['player1', 'player2'],
    });

    return matches;
  }
}
