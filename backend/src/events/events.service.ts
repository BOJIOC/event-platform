import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    private usersService: UsersService,
  ) {}

  findAll(): Promise<Event[]> {
    return this.eventsRepository.find({ relations: ['organizer', 'participants'] });
  }

  async findOne(id: number): Promise<Event> {
    const event = await this.eventsRepository.findOne({
      where: { id },
      relations: ['organizer', 'participants'],
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return event;
  }
  
	async findMyEvents(userId: number): Promise<Event[]> {
	  return this.eventsRepository.find({
		where: { organizer: { id: userId } },
		relations: ['organizer', 'participants'],
	  });
	}

async findParticipatedEvents(userId: number): Promise<Event[]> {
  try {
    console.log('[findParticipatedEvents] userId =', userId)

    return await this.eventsRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.participants', 'participant')
      .leftJoinAndSelect('event.organizer', 'organizer')
      .where('participant.id = :userId', { userId })
      .getMany()
  } catch (error) {
    console.error('[findParticipatedEvents] Ошибка:', error)
    throw new Error('Ошибка получения мероприятий')
  }
}


async unjoinEvent(eventId: number, userId: number): Promise<Event> {
  const event = await this.findOne(eventId);
  const user = await this.usersService.findOne(userId);

  if (!event.participants) {
    event.participants = [];
  }

  event.participants = event.participants.filter((p) => p.id !== user.id);

  return this.eventsRepository.save(event);
}


  async create(data: CreateEventDto, organizerId: number): Promise<Event> {
    const organizer = await this.usersService.findOne(organizerId);

    const event = this.eventsRepository.create({
      ...data,
      organizer,
    });

    return this.eventsRepository.save(event);
  }

  async joinEvent(eventId: number, userId: number): Promise<Event> {
    const event = await this.findOne(eventId);
    const user = await this.usersService.findOne(userId);

    if (!event.participants) {
      event.participants = [];
    }

    // Предотвратим повторное добавление
    if (!event.participants.some(p => p.id === user.id)) {
      event.participants.push(user);
    }

    return this.eventsRepository.save(event);
  }

	async update(
	  eventId: number,
	  userId: number,
	  data: Partial<{ title: string; description: string; date: Date }>,
	  userRole: string,
	): Promise<Event> {
	  const event = await this.findOne(eventId);

	  // Только организатор или админ
	  if (event.organizer.id !== userId && userRole !== 'admin') {
		throw new Error('Нет доступа к редактированию этого мероприятия');
	  }

	  Object.assign(event, data);
	  return this.eventsRepository.save(event);
	}

async searchEvents(
  title?: string,
  from?: string,
  to?: string,
): Promise<Event[]> {
  const query = this.eventsRepository
    .createQueryBuilder('event')
    .leftJoinAndSelect('event.organizer', 'organizer')
    .leftJoinAndSelect('event.participants', 'participants');

  if (title) {
    query.andWhere('LOWER(event.title) LIKE LOWER(:title)', {
      title: `%${title}%`,
    });
  }

  if (from) {
    query.andWhere('event.date >= :from', { from });
  }

  if (to) {
    query.andWhere('event.date <= :to', { to });
  }

  return query.getMany();
}


  async remove(id: number): Promise<void> {
    await this.eventsRepository.delete(id);
  }
}
