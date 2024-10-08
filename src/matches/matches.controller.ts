import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { MatchesService } from './matches.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { MatchResultDto } from './dto/post-match-result.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('matches')
@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new match' })
  @ApiResponse({ status: 201, description: 'Match created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({ type: CreateMatchDto })
  create(@Body() createMatchDto: CreateMatchDto) {
    return this.matchesService.create(createMatchDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all matches' })
  @ApiResponse({ status: 200, description: 'List of matches.' })
  findAll() {
    return this.matchesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a match by ID' })
  @ApiParam({ name: 'id', description: 'ID of the match' })
  @ApiResponse({ status: 200, description: 'Match found.' })
  @ApiResponse({ status: 404, description: 'Match not found.' })
  findOne(@Param('id') id: string) {
    return this.matchesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a match' })
  @ApiParam({ name: 'id', description: 'ID of the match' })
  @ApiResponse({ status: 200, description: 'Match updated successfully.' })
  @ApiResponse({ status: 404, description: 'Match not found.' })
  @ApiBody({ type: UpdateMatchDto })
  update(@Param('id') id: string, @Body() updateMatchDto: UpdateMatchDto) {
    return this.matchesService.update(+id, updateMatchDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a match' })
  @ApiParam({ name: 'id', description: 'ID of the match' })
  @ApiResponse({ status: 200, description: 'Match deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Match not found.' })
  remove(@Param('id') id: string) {
    return this.matchesService.remove(+id);
  }

  @Post('result/:id')
  @ApiOperation({ summary: 'Post match results' })
  @ApiParam({ name: 'id', description: 'ID of the match' })
  @ApiResponse({ status: 200, description: 'Match results updated.' })
  @ApiResponse({ status: 404, description: 'Match not found.' })
  @ApiBody({ type: MatchResultDto })
  result(@Param('id') id: string, @Body() matchResultDto: MatchResultDto) {
    return this.matchesService.updateMatchResults(+id, matchResultDto);
  }

  @Get('tournament/:tournamentId')
  @ApiOperation({ summary: 'Get matches by tournament ID' })
  @ApiParam({ name: 'tournamentId', description: 'ID of the tournament' })
  @ApiResponse({
    status: 200,
    description: 'List of matches for the tournament.',
  })
  @ApiResponse({
    status: 404,
    description: 'Matches not found for the tournament.',
  })
  getMatchesByTournament(
    @Param('tournamentId', ParseIntPipe) tournamentId: number,
  ) {
    return this.matchesService.findMatchesByTournament(tournamentId);
  }
}
