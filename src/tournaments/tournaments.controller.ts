import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { AddUserToTournamentDto } from './dto/add-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('tournaments') // Agrupa las rutas bajo 'tournaments'
@Controller('tournaments')
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new tournament' })
  @ApiResponse({ status: 201, description: 'Tournament created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({ type: CreateTournamentDto })
  create(@Body() createTournamentDto: CreateTournamentDto) {
    return this.tournamentsService.create(createTournamentDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all tournaments with optional filters and pagination',
  })
  @ApiQuery({ name: 'tournamentId', required: false, type: Number }) // Opcional
  @ApiQuery({ name: 'minScore', required: false, type: Number }) // Opcional
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
  })
  @ApiResponse({ status: 200, description: 'List of tournaments.' })
  @ApiResponse({ status: 400, description: 'Invalid parameters.' })
  findAll(
    @Query('tournamentId', ParseIntPipe) tournamentId?: number,
    @Query('minScore', ParseIntPipe) minScore?: number,
    @Query('page', ParseIntPipe) page?: number,
    @Query('limit', ParseIntPipe) limit?: number,
  ) {
    const paginationOptions = {
      page: page ? Math.max(1, page) : 1,
      limit: limit ? Math.min(100, limit) : 10,
    };

    return this.tournamentsService.findAll(
      tournamentId,
      minScore,
      paginationOptions,
    );
  }

  @Get('automatch/:id')
  @ApiOperation({
    summary: 'Automatch all the users of the tournaments',
  })
  automatch(@Param('id', ParseIntPipe) id: number) {
    return this.tournamentsService.automatch(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a tournament by ID' })
  @ApiParam({ name: 'id', description: 'ID of the tournament' })
  @ApiResponse({ status: 200, description: 'Tournament found.' })
  @ApiResponse({ status: 404, description: 'Tournament not found.' })
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.tournamentsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a tournament' })
  @ApiParam({ name: 'id', description: 'ID of the tournament' })
  @ApiResponse({ status: 200, description: 'Tournament updated successfully.' })
  @ApiResponse({ status: 404, description: 'Tournament not found.' })
  @ApiBody({ type: UpdateTournamentDto })
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateTournamentDto: UpdateTournamentDto,
  ) {
    return this.tournamentsService.update(+id, updateTournamentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a tournament' })
  @ApiParam({ name: 'id', description: 'ID of the tournament' })
  @ApiResponse({ status: 200, description: 'Tournament deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Tournament not found.' })
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.tournamentsService.remove(+id);
  }

  @Post('add-user/:id')
  @ApiOperation({ summary: 'Add users to a tournament' })
  @ApiParam({ name: 'id', description: 'ID of the tournament' })
  @ApiResponse({
    status: 200,
    description: 'Users added to tournament successfully.',
  })
  @ApiResponse({ status: 404, description: 'Tournament not found.' })
  @ApiBody({ type: AddUserToTournamentDto })
  async addUserToTournament(
    @Param('id', ParseIntPipe) tournamentId: string,
    @Body() addUserDto: AddUserToTournamentDto,
  ) {
    return this.tournamentsService.addUserToTournament(
      +tournamentId,
      addUserDto,
    );
  }
}
