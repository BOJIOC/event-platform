import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Comment } from '../comments/comment.entity';  // ← импорт

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  date: Date;

  /** Организатор события */
  @ManyToOne(() => User, (user) => user.events)
  organizer: User;

  /** Участники события */
  @ManyToMany(() => User, (user) => user.eventsAsParticipant)
  participants: User[];

  /** Комментарии к событию */
  @OneToMany(() => Comment, (comment) => comment.event, { cascade: true })
  comments: Comment[];
}
