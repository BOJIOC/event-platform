import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Comments')
@Controller('events/:id/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  @ApiOperation({ summary: 'Список комментариев события' })
  findForEvent(@Param('id') id: string) {
    return this.commentsService.findForEvent(+id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Добавить комментарий к событию' })
  create(
    @Param('id') id: string,
    @CurrentUser() user,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentsService.create(+id, user.id, dto);
  }
}