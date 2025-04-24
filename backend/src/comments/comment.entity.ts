import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Event } from '../events/event.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @ManyToOne(() => User, user => user.comments, { eager: true })
  author: User;

  @ManyToOne(() => Event, event => event.comments, { onDelete: 'CASCADE' })
  event: Event;

  @CreateDateColumn()
  createdAt: Date;
}
