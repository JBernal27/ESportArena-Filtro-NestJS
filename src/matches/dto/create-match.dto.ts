import { IsNotEmpty } from 'class-validator';

export class CreateMatchDto {
  @IsNotEmpty()
  player1: number;

  @IsNotEmpty()
  player2: number;

  @IsNotEmpty()
  tournament: number;
}
