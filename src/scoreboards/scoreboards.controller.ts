import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ScoreboardsService } from './scoreboards.service';
import { UpdateScoreboardDto } from './dto/update-scoreboard.dto';
import { CreateScoreboardDto } from './dto/create-scoreboard.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('scoreboards')
@Controller('scoreboards')
export class ScoreboardsController {
  constructor(private readonly scoreboardsService: ScoreboardsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new scoreboard' }) // Resumen de la operación
  @ApiResponse({ status: 201, description: 'Scoreboard created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({ type: CreateScoreboardDto })
  create(@Body() createScoreboardDto: CreateScoreboardDto) {
    return this.scoreboardsService.create(createScoreboardDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all scoreboards' })
  @ApiResponse({ status: 200, description: 'List of scoreboards.' })
  findAll() {
    return this.scoreboardsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a scoreboard by ID' })
  @ApiParam({ name: 'id', description: 'ID of the scoreboard' }) // Parámetro en Swagger
  @ApiResponse({ status: 200, description: 'Scoreboard found.' })
  @ApiResponse({ status: 404, description: 'Scoreboard not found.' })
  findOne(@Param('id') id: string) {
    return this.scoreboardsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a scoreboard' })
  @ApiParam({ name: 'id', description: 'ID of the scoreboard' })
  @ApiResponse({ status: 200, description: 'Scoreboard updated successfully.' })
  @ApiResponse({ status: 404, description: 'Scoreboard not found.' })
  @ApiBody({ type: UpdateScoreboardDto })
  update(
    @Param('id') id: string,
    @Body() updateScoreboardDto: UpdateScoreboardDto,
  ) {
    return this.scoreboardsService.update(+id, updateScoreboardDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a scoreboard' })
  @ApiParam({ name: 'id', description: 'ID of the scoreboard' })
  @ApiResponse({ status: 200, description: 'Scoreboard deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Scoreboard not found.' })
  remove(@Param('id') id: string) {
    return this.scoreboardsService.remove(+id);
  }
}
