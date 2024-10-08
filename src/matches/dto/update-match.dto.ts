import { PartialType } from '@nestjs/swagger';
import { CreateMatchDto } from './create-match.dto';
import { IsNumber, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMatchDto extends PartialType(CreateMatchDto) {
  @ApiPropertyOptional({
    example: 6,
    description: 'Updated result score of player 1',
  })
  @IsOptional()
  @IsNumber()
  player1Result?: number;

  @ApiPropertyOptional({
    example: 4,
    description: 'Updated result score of player 2',
  })
  @IsOptional()
  @IsNumber()
  player2Result?: number;

  @ApiPropertyOptional({
    example: 130,
    description: 'Updated total time in minutes the match lasted',
  })
  @IsOptional()
  @IsNumber()
  totalTime?: number;
}
