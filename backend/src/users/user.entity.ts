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

@Entity()
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

  /** События, которые организовал этот пользователь */
  @OneToMany(() => Event, (event) => event.organizer)
  events: Event[];

  /** События, в которых участвует как участник */
  @ManyToMany(() => Event, (event) => event.participants)
  @JoinTable()
  eventsAsParticipant: Event[];

  /** Комментарии, написанные этим пользователем */
  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];
}
