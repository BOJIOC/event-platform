import {
  Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Req,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

/**
 * EventsController обрабатывает HTTP-запросы для работы с мероприятиями.
 * Все методы защищены JWT: без токена к эндпоинтам нельзя.
 */
@UseGuards(JwtAuthGuard)
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  /** GET /events — возвращает все события */
  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  /** GET /events/search?... — фильтрация по title, from, to */
  @Get('search')
  search(
    @Req() req,
  ) {
    const { title, from, to } = req.query;
    return this.eventsService.searchEvents(title, from, to);
  }

  /** GET /events/:id — детали одного события */
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.eventsService.findOne(+id);
  }

  /** POST /events — создание нового события; организатор из JWT */
  @Post()
  create(@Req() req, @Body() dto: CreateEventDto) {
    const user = req.user; // payload из JwtStrategy
    return this.eventsService.create(dto, user);
  }

  /** PATCH /events/:id — обновление события; только организатор или админ */
  @Patch(':id')
  update(
    @Req() req,
    @Param('id') id: number,
    @Body() dto: UpdateEventDto,
  ) {
    const user = req.user;
    return this.eventsService.update(+id, user, dto, user.role);
  }

  /** DELETE /events/:id — удаление события по ID */
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.eventsService.remove(+id);
  }

  /** POST /events/:id/join — присоединиться к событию */
  @Post(':id/join')
  join(@Req() req, @Param('id') id: number) {
    return this.eventsService.joinEvent(+id, req.user);
  }

  /** POST /events/:id/unjoin — отписаться от события */
  @Post(':id/unjoin')
  unjoin(@Req() req, @Param('id') id: number) {
    return this.eventsService.unjoinEvent(+id, req.user);
  }

  /** GET /events/my — мои созданные события (организатор) */
  @Get('my')
  findMy(@Req() req) {
    return this.eventsService.findMyEvents(req.user.id);
  }

  /** GET /events/participated — события, где я участник */
  @Get('participated')
  findParticipated(@Req() req) {
    return this.eventsService.findParticipatedEvents(req.user.id);
  }
}
