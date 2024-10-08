import { IsNotEmpty, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateScoreboardDto {
  @ApiProperty({
    example: 1,
    description: 'ID of the user whose score will be updated',
  })
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    example: 3,
    description: "Number of points to add to the user's score",
  })
  @IsPositive()
  pointsToAdd: number;
}
