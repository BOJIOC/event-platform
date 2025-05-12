import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { EventsService } from '../events/events.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly eventsService: EventsService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Возвращает все комментарии для события с сортировкой по времени.
   */
  async findAll(eventId: number): Promise<Comment[]> {
    await this.eventsService.findOne(eventId); // проверка существования события
    return this.commentRepository.find({
      where: { event: { id: eventId } },
      order: { createdAt: 'ASC' },
      relations: ['author'],
    });
  }

  /**
   * Создаёт новый комментарий:
   * 1) проверяет событие
   * 2) загружает автора
   * 3) сохраняет комментарий с датой
   */
  async create(
    eventId: number,
    userId: number,
    content: string,
  ): Promise<Comment> {
    const event = await this.eventsService.findOne(eventId);
    const author = await this.usersService.findOne(userId);
    const comment = this.commentRepository.create({
      content,
      event,
      author,
    });
    return this.commentRepository.save(comment);
  }
}
