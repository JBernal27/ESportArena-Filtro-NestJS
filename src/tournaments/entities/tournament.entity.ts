import { Match } from 'src/matches/entities/match.entity';
import { Scoreboard } from 'src/scoreboards/entities/scoreboard.entity'; // Asegúrate de importar correctamente
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tournaments')
export class Tournaments {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  award: number;

  @Column({ default: false })
  is_deleted: boolean;

  @OneToMany(() => Match, (match) => match.tournament)
  matches: Match[];

  @OneToMany(() => Scoreboard, (scoreboard) => scoreboard.tournament)
  scoreboards: Scoreboard[];

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
