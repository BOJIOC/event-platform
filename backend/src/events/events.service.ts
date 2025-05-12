import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './event.entity';
import { User } from '../users/user.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  /**
   * Возвращает все события, вместе с организатором и участниками.
   */
  async findAll(): Promise<Event[]> {
    return this.eventRepository.find({
      relations: ['organizer', 'participants'],
    });
  }

  /**
   * Ищет события по названию и диапазону дат.
   * Строит dynamic SQL через QueryBuilder:
   * - ILIKE для нечувствительного к регистру поиска по названию
   * - >= / <= для фильтрации по дате
   */
  async searchEvents(
    title?: string,
    from?: string,
    to?: string,
  ): Promise<Event[]> {
    const qb: SelectQueryBuilder<Event> = this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.organizer', 'organizer')
      .leftJoinAndSelect('event.participants', 'participants');

    if (title) {
      qb.andWhere('event.title ILIKE :title', { title: `%${title}%` });
    }
    if (from) {
      qb.andWhere('event.date >= :from', { from });
    }
    if (to) {
      qb.andWhere('event.date <= :to', { to });
    }

    return qb.getMany();
  }

  /**
   * Возвращает одно событие по ID.
   * Бросает NotFoundException, если не найдено.
   */
  async findOne(id: number): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['organizer', 'participants'],
    });
    if (!event) {
      throw new NotFoundException(`Event with id=${id} not found`);
    }
    return event;
  }

  /**
   * Создаёт новое событие, связывая DTO и пользователя-организатора.
   */
  async create(dto: CreateEventDto, organizer: User): Promise<Event> {
    const event = this.eventRepository.create({ ...dto, organizer });
    return this.eventRepository.save(event);
  }

  /**
   * Позволяет пользователю присоединиться к событию:
   * - Проверяет, что он ещё не участник
   * - Добавляет в массив participants
   */
  async joinEvent(id: number, user: User): Promise<void> {
    const event = await this.findOne(id);
    if (event.participants.some(p => p.id === user.id)) {
      return; // уже присоединён
    }
    event.participants.push(user);
    await this.eventRepository.save(event);
  }

  /**
   * Удаляет пользователя из participants.
   */
  async unjoinEvent(id: number, user: User): Promise<void> {
    const event = await this.findOne(id);
    event.participants = event.participants.filter(p => p.id !== user.id);
    await this.eventRepository.save(event);
  }

  /**
   * Обновляет событие: только организатор или админ.
   */
  async update(
    id: number,
    user: User,
    dto: UpdateEventDto,
    role: string,
  ): Promise<Event> {
    const event = await this.findOne(id);
    if (event.organizer.id !== user.id && role !== 'admin') {
      throw new ForbiddenException();
    }
    Object.assign(event, dto);
    return this.eventRepository.save(event);
  }

  /**
   * Удаляет событие по ID.
   */
  async remove(id: number): Promise<void> {
    await this.eventRepository.delete(id);
  }

  /**
   * Возвращает события, созданные данным пользователем.
   */
  async findMyEvents(userId: number): Promise<Event[]> {
    return this.eventRepository.find({
      where: { organizer: { id: userId } },
      relations: ['organizer', 'participants'],
    });
  }

  /**
   * Возвращает события, в которых участвует данный пользователь.
   */
  async findParticipatedEvents(userId: number): Promise<Event[]> {
    return this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.participants', 'p')
      .where('p.id = :userId', { userId })
      .leftJoinAndSelect('event.organizer', 'organizer')
      .getMany();
  }
}
