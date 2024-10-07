import { Match } from 'src/matches/entities/match.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
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

  @ManyToMany(() => User, (user) => user.tournaments)
  @JoinTable()
  users: User[];

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
