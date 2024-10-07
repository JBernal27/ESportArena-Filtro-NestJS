import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTournamentDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  award: number;

  @IsArray()
  @IsOptional()
  users: number[];
}
