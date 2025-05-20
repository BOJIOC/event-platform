// src/tasks/tasks.module.ts
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TasksService } from './tasks.service'
import { TasksController } from './tasks.controller'
import { Task } from './task.entity'
import { EventsModule } from '../events/events.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    EventsModule, // чтобы можно было проверять event
  ],
  providers: [TasksService],
  controllers: [TasksController],
})
export class TasksModule {}
