import { roles } from 'src/common/enums/roles.enum';
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

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true, unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  role: roles;

  @Column({ default: false })
  is_deleted: boolean;

  @OneToMany(() => Match, (match) => match.player1)
  matchesAsPlayer1: Match[];

  @OneToMany(() => Match, (match) => match.player2)
  matchesAsPlayer2: Match[];

  @OneToMany(() => Scoreboard, (scoreboard) => scoreboard.user)
  scoreboards: Scoreboard[];

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
