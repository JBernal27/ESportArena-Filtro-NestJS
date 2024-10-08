import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddUserToTournamentDto {
  @ApiProperty({
    example: 1,
    description: 'ID of the user to add to the tournament',
  })
  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
