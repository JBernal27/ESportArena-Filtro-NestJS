import { IsNumber } from 'class-validator';

export class MatchResultDto {
  @IsNumber()
  player1Result?: number;

  @IsNumber()
  player2Result?: number;

  @IsNumber()
  totalTime?: number;
}
