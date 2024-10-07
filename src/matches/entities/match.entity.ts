import { Tournaments } from 'src/tournaments/entities/tournament.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('matches')
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.matchesAsPlayer1)
  player1: User;

  @ManyToOne(() => User, (user) => user.matchesAsPlayer2)
  player2: User;

  @Column()
  player1Result: number;

  @Column()
  player2Result: number;

  @Column()
  totalTime: number; // Tiempo total de la partida en segundos

  @ManyToOne(() => Tournaments, (tournament) => tournament.matches)
  tournament: Tournaments;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
