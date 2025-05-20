import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { EventsService } from '../events/events.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
    private readonly eventsService: EventsService,  // чтобы проверить права организатора/участника
  ) {}

  async findAll(eventId: number): Promise<Task[]> {
    return this.taskRepo.find({ where: { event: { id: eventId } } });
  }

  async create(eventId: number, dto: CreateTaskDto, userId: number): Promise<Task> {
    // проверяем, что пользователь — организатор или участник
    const isParticipant = await this.eventsService.isParticipant(eventId, userId);
    if (!isParticipant) throw new ForbiddenException('Нет доступа к задачам этого события');

    const task = this.taskRepo.create({ ...dto, done: false, event: { id: eventId } as any });
    return this.taskRepo.save(task);
  }

  async update(
    eventId: number,
    taskId: number,
    dto: UpdateTaskDto,
    userId: number,
  ): Promise<Task> {
    // проверяем участие
    const isParticipant = await this.eventsService.isParticipant(eventId, userId);
    if (!isParticipant) throw new ForbiddenException('Нет доступа к задачам этого события');

    const task = await this.taskRepo.findOne({ where: { id: taskId, event: { id: eventId } } });
    if (!task) throw new NotFoundException('Задача не найдена');
    Object.assign(task, dto);
    return this.taskRepo.save(task);
  }

  async remove(eventId: number, taskId: number, userId: number): Promise<void> {
    // проверяем участие
    const isParticipant = await this.eventsService.isParticipant(eventId, userId);
    if (!isParticipant) throw new ForbiddenException('Нет доступа к задачам этого события');

    const task = await this.taskRepo.findOne({ where: { id: taskId, event: { id: eventId } } });
    if (!task) throw new NotFoundException('Задача не найдена');
    await this.taskRepo.remove(task);
  }
}
