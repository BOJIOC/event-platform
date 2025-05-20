import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ParticipantGuard } from '../auth/guards/participant.guard';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('events/:id/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  findAll(@Param('id') eventId: number) {
    return this.commentsService.findAll(eventId);
  }

  // Только участники могут оставлять комментарии
  @UseGuards(JwtAuthGuard, ParticipantGuard)
  @Post()
  create(
    @Param('id') eventId: number,
    @Body() dto: CreateCommentDto,
    @Req() req,
  ) {
    return this.commentsService.create(eventId, dto, req.user.id);
  }
}
