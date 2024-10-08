import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTournamentDto {
  @ApiProperty({
    example: 'Champions Cup',
    description: 'Name of the tournament',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'A tournament for the best players in the world.',
    description: 'Description of the tournament',
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: 5000,
    description: 'The award money for the winner of the tournament',
  })
  @IsNumber()
  award: number;

  @ApiProperty({
    example: [1, 2, 3],
    description: 'Array of user IDs participating in the tournament',
    type: [Number],
    required: false,
  })
  @IsArray()
  @IsOptional()
  users: number[];
}
