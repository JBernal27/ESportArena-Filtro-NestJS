import { IsNumber, IsString } from 'class-validator';

export class CreateTournamentDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  award: number;
}
