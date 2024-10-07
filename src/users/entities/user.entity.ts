import { roles } from 'src/common/enums/roles.enum';
import { Match } from 'src/matches/entities/match.entity';
import { Tournaments } from 'src/tournaments/entities/tournament.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
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

  @ManyToMany(() => Tournaments, (tournament) => tournament.users)
  tournaments: Tournaments[];

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
