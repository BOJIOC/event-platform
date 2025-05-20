import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('events/:id/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(@Param('id') eventId: number) {
    return this.tasksService.findAll(eventId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Param('id') eventId: number,
    @Body() dto: CreateTaskDto,
    @Req() req,
  ) {
    return this.tasksService.create(eventId, dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':taskId')
  update(
    @Param('id') eventId: number,
    @Param('taskId') taskId: number,
    @Body() dto: UpdateTaskDto,
    @Req() req,
  ) {
    return this.tasksService.update(eventId, taskId, dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':taskId')
  remove(
    @Param('id') eventId: number,
    @Param('taskId') taskId: number,
    @Req() req,
  ) {
    return this.tasksService.remove(eventId, taskId, req.user.id);
  }
}
