import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MatchResultDto {
  @ApiProperty({
    example: 5,
    description: 'Result score of player 1',
  })
  @IsNumber()
  player1Result?: number;

  @ApiProperty({
    example: 3,
    description: 'Result score of player 2',
  })
  @IsNumber()
  player2Result?: number;

  @ApiProperty({
    example: 120,
    description: 'Total time in minutes the match lasted',
  })
  @IsNumber()
  totalTime?: number;
}
