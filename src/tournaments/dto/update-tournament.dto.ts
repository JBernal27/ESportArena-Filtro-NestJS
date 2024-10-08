import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTournamentDto {
  @ApiProperty({
    example: 'Champions Cup 2024',
    description: 'Updated name of the tournament',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Updated description for the tournament.',
    description: 'Updated description of the tournament',
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: 6000,
    description: 'Updated award money for the winner of the tournament',
  })
  @IsNumber()
  award: number;
}
