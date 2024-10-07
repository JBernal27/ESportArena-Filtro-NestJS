import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Tournaments } from './entities/tournament.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TournamentsService {
  constructor(
    @InjectRepository(Tournaments)
    private readonly tournamentsRepository: Repository<Tournaments>,
    private readonly usersService: UsersService,
  ) {}
  async create(createTournamentDto: CreateTournamentDto) {
    const users: User[] = [];

    if (createTournamentDto.users.length > 0) {
      for (const userId of createTournamentDto.users) {
        const user = await this.usersService.findOne(userId);
        if (!user) {
          throw new NotFoundException(`User with ID ${userId} not found`);
        }
        users.push(user);
      }
    }

    const tournament = this.tournamentsRepository.create({
      ...createTournamentDto,
      users: users,
    });

    await this.tournamentsRepository.save(tournament);

    const createdTournament = await this.tournamentsRepository.findOne({
      where: { id: tournament.id },
      relations: ['users'],
    });

    return createdTournament;
  }

  async findAll() {
    return await this.tournamentsRepository.find({
      where: { is_deleted: false },
      relations: ['users'],
    });
  }

  async findOne(id: number) {
    const tournament = await this.tournamentsRepository.findOne({
      where: { id: id, is_deleted: false },
      relations: ['users'],
    });

    if (!tournament) {
      throw new NotFoundException(`Tournament with ID ${id} not found`);
    }

    return tournament;
  }

  async update(id: number, updateTournamentDto: UpdateTournamentDto) {
    const tournament = await this.tournamentsRepository.findOne({
      where: { id: id, is_deleted: false },
      relations: ['users'],
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
}
