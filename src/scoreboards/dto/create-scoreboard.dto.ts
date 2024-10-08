import { IsNotEmpty, IsArray, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateScoreboardDto {
  @ApiProperty({
    example: 1,
    description: 'ID of the tournament associated with this scoreboard',
  })
  @IsNotEmpty()
  @IsNumber()
  tournamentId: number;

  @ApiProperty({
    example: [1, 2, 3],
    description: 'Array of user IDs to be included in the scoreboard',
    type: [Number],
  })
  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  users: number[];
}
