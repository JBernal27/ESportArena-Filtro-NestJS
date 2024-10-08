import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMatchDto {
  @ApiProperty({
    example: 1,
    description: 'ID of the first player',
  })
  @IsNotEmpty()
  player1: number;

  @ApiProperty({
    example: 2,
    description: 'ID of the second player',
  })
  @IsNotEmpty()
  player2: number;

  @ApiProperty({
    example: 3,
    description: 'ID of the tournament in which the match takes place',
  })
  @IsNotEmpty()
  tournament: number;
}
