// src/tasks/task.entity.ts
import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne
} from 'typeorm'
import { Event } from '../events/event.entity'

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  content: string

  @Column({ default: false })
  done: boolean

  @ManyToOne(() => Event, (event) => event.tasks, { onDelete: 'CASCADE' })
  event: Event
}
