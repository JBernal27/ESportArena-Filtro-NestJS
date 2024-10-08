import { User } from 'src/users/entities/user.entity';
import { Tournaments } from 'src/tournaments/entities/tournament.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('scoreboards')
export class Scoreboard {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Tournaments, (tournament) => tournament.scoreboards)
  tournament: Tournaments;

  @ManyToOne(() => User, (user) => user.scoreboards)
  user: User;

  @Column({ default: 0 })
  score: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
