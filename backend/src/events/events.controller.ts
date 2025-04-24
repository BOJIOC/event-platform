import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Patch,
  Query,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @ApiOperation({ summary: 'Получить все мероприятия' })
  findAll() {
    return this.eventsService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Поиск и фильтрация мероприятий по названию и дате' })
  search(
    @Query('title') title?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.eventsService.searchEvents(title, from, to);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Мероприятия, созданные текущим пользователем' })
  findMy(@CurrentUser() user) {
    return this.eventsService.findMyEvents(user.id);
  }

  @Get('participated')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Мероприятия, в которых участвует текущий пользователь' })
  findParticipated(@CurrentUser() user) {
    console.log('[EventsController.findParticipated] user =', user);
    return this.eventsService.findParticipatedEvents(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить мероприятие по ID' })
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(+id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Создать мероприятие (только для авторизованных)' })
  create(@Body() dto: CreateEventDto, @CurrentUser() user) {
    return this.eventsService.create(dto, user.id);
  }

  @Post(':id/join')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Пользователь присоединяется к мероприятию' })
  join(@Param('id') id: string, @CurrentUser() user) {
    return this.eventsService.joinEvent(+id, user.id);
  }

  @Post(':id/unjoin')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Пользователь отписывается от мероприятия' })
  unjoin(@Param('id') id: string, @CurrentUser() user) {
    return this.eventsService.unjoinEvent(+id, user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Редактировать мероприятие (только организатор или админ)' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateEventDto,
    @CurrentUser() user,
  ) {
    return this.eventsService.update(+id, user.id, dto, user.role);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Удалить мероприятие (только для админов)' })
  remove(@Param('id') id: string) {
    return this.eventsService.remove(+id);
  }
}
