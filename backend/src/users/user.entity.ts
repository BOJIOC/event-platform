// src/users/user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Event } from '../events/event.entity';
import { Comment } from '../comments/comment.entity';

@Entity('users') // явно задаём имя таблицы «users»
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;
  
  @Column({ default: 'user' })
  role: 'user' | 'admin';

  @OneToMany(() => Event, (event) => event.organizer)
  events: Event[];

  @ManyToMany(() => Event, (event) => event.participants)
  eventsAsParticipant: Event[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];
}
