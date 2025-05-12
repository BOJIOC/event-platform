import {
  Controller, Get, Post, Param, Body, UseGuards, Req,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

/**
 * CommentsController отвечает за эндпоинты:
 * GET  /events/:id/comments
 * POST /events/:id/comments
 */
@UseGuards(JwtAuthGuard)
@Controller('events/:id/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  /** GET текущий список комментариев к событию */
  @Get()
  findAll(@Param('id') eventId: number) {
    return this.commentsService.findAll(+eventId);
  }

  /** POST новый комментарий — связывается с eventId и userId из req.user */
  @Post()
  create(
    @Param('id') eventId: number,
    @Req() req,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentsService.create(+eventId, req.user.id, dto.content);
  }
}
