import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

/**
 * EventsController — HTTP-интерфейс для работы с мероприятиями.
 */
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  /** GET /api/events */
  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  /** GET /api/events/search?title=&from=&to= */
  @Get('search')
  search(
    @Query('title') title?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.eventsService.searchEvents(title, from, to);
  }

  /** GET /api/events/my */
  @UseGuards(JwtAuthGuard)
  @Get('my')
  findMy(@Request() req) {
    return this.eventsService.findMyEvents(req.user.id);
  }

  /** GET /api/events/participated */
  @UseGuards(JwtAuthGuard)
  @Get('participated')
  findParticipated(@Request() req) {
    return this.eventsService.findParticipatedEvents(req.user.id);
  }

  /** GET /api/events/:id */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.findOne(id);
  }

  /** POST /api/events */
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() dto: CreateEventDto) {
    return this.eventsService.create(dto, req.user.id);
  }

  /** POST /api/events/:id/join */
  @UseGuards(JwtAuthGuard)
  @Post(':id/join')
  join(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    return this.eventsService.joinEvent(id, req.user.id);
  }

  /** POST /api/events/:id/unjoin */
  @UseGuards(JwtAuthGuard)
  @Post(':id/unjoin')
  unjoin(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    return this.eventsService.unjoinEvent(id, req.user.id);
  }

  /** PATCH /api/events/:id */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user', 'admin')
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() dto: UpdateEventDto,
  ) {
    return this.eventsService.update(id, req.user.id, dto, req.user.role);
  }

  /** DELETE /api/events/:id */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user', 'admin')
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    console.log('Delete event req.user:', req.user); // Лог для дебага
    return this.eventsService.remove(id, req.user.id, req.user.role);
  }
}
