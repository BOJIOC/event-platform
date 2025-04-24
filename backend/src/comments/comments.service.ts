import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UsersService } from '../users/users.service';
import { EventsService } from '../events/events.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepo: Repository<Comment>,
    private usersService: UsersService,
    private eventsService: EventsService,
  ) {}

  async findForEvent(eventId: number): Promise<Comment[]> {
    const event = await this.eventsService.findOne(eventId);
    return this.commentsRepo.find({ where: { event }, order: { createdAt: 'ASC' } });
  }

  async create(
    eventId: number,
    userId: number,
    dto: CreateCommentDto,
  ): Promise<Comment> {
    const author = await this.usersService.findOne(userId);
    const event = await this.eventsService.findOne(eventId);
    const comment = this.commentsRepo.create({ content: dto.content, author, event });
    return this.commentsRepo.save(comment);
  }
}