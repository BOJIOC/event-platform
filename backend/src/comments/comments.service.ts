// src/comments/comments.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { EventsService } from '../events/events.service';
import { User } from '../users/user.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    private readonly eventsService: EventsService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findAll(eventId: number): Promise<Comment[]> {
    await this.eventsService.findOne(eventId);
    return this.commentRepo.find({
      where: { event: { id: eventId } },
      relations: ['author'],
    });
  }

  async create(
    eventId: number,
    dto: CreateCommentDto,
    userId: number,
  ): Promise<Comment> {
    const event = await this.eventsService.findOne(eventId);
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const comment = this.commentRepo.create({
      content: dto.content,
      event,
      author: user,
    });
    return this.commentRepo.save(comment);
  }
}
