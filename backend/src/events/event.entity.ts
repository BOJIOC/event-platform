// src/events/event.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Comment } from '../comments/comment.entity';
import { Task } from '../tasks/task.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  // Разрешаем NULL, чтобы синхронизация не падала
  @Column('text', { nullable: true })
  description: string | null;

  @Column()
  date: Date;

  @ManyToOne(() => User, (user) => user.events, { eager: true })
  organizer: User;

	@ManyToMany(() => User, (user) => user.eventsAsParticipant)
	@JoinTable({ name: 'user_events_as_participant_event' }) // ЯВНО имя!
	participants: User[];

  @OneToMany(() => Comment, (comment) => comment.event, { cascade: true })
  comments: Comment[];

  @OneToMany(() => Task, (task) => task.event, { cascade: true })
  tasks: Task[];
}
