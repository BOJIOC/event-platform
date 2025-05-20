// src/events/events.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { User } from '../users/user.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepo: Repository<Event>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findAll(): Promise<Event[]> {
    return this.eventRepo.find({
      relations: ['organizer', 'participants'],
    });
  }

  async searchEvents(
    title?: string,
    from?: string,
    to?: string,
  ): Promise<Event[]> {
    const qb = this.eventRepo
      .createQueryBuilder('e')
      .leftJoinAndSelect('e.organizer', 'o')
      .leftJoinAndSelect('e.participants', 'p');

    if (title) qb.andWhere('e.title ILIKE :t', { t: `%${title}%` });
    if (from) qb.andWhere('e.date >= :from', { from });
    if (to) qb.andWhere('e.date <= :to', { to });

    return qb.getMany();
  }

  async findMyEvents(userId: number): Promise<Event[]> {
    return this.eventRepo.find({
      where: { organizer: { id: userId } },
      relations: ['organizer', 'participants'],
    });
  }

  async findParticipatedEvents(userId: number): Promise<Event[]> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: [
        'eventsAsParticipant',
        'eventsAsParticipant.organizer',
        'eventsAsParticipant.participants',
      ],
    });
    if (!user) throw new NotFoundException('User not found');
    return user.eventsAsParticipant;
  }

  async findOne(id: number): Promise<Event> {
    const ev = await this.eventRepo.findOne({
      where: { id },
      relations: ['organizer', 'participants', 'comments', 'tasks'],
    });
    if (!ev) throw new NotFoundException('Event not found');
    return ev;
  }

	async create(dto: CreateEventDto, userId: number): Promise<Event> {
	  const organizer = await this.userRepo.findOne({ where: { id: userId } });
	  if (!organizer) throw new NotFoundException('User not found');
	  const ev = this.eventRepo.create({ ...dto, organizer });
	  // Добавляем организатора как участника
	  ev.participants = [organizer];
	  return this.eventRepo.save(ev);
	}


  /**
   * Надёжно добавляем связь в join-таблицу,
   * не пытаясь вставить несуществующий eventId.
   */
  async joinEvent(eventId: number, userId: number): Promise<void> {
    const ev = await this.eventRepo.findOne({ where: { id: eventId } });
    if (!ev) throw new NotFoundException('Event not found');
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    await this.eventRepo
      .createQueryBuilder()
      .relation(Event, 'participants')
      .of(ev)       // можно и .of(eventId)
      .add(user);   // или .add(userId)
  }

  /**
   * Надёжно удаляем связь из join-таблицы.
   */
  async unjoinEvent(eventId: number, userId: number): Promise<void> {
    const ev = await this.eventRepo.findOne({ where: { id: eventId } });
    if (!ev) throw new NotFoundException('Event not found');

    await this.eventRepo
      .createQueryBuilder()
      .relation(Event, 'participants')
      .of(ev)         // либо .of(eventId)
      .remove(userId);
  }

  async update(
    id: number,
    userId: number,
    dto: UpdateEventDto,
    role: string,
  ): Promise<Event> {
    const ev = await this.findOne(id);
    if (ev.organizer.id !== userId && role !== 'admin') {
      throw new ForbiddenException('Нет прав на изменение');
    }
    Object.assign(ev, dto);
    return this.eventRepo.save(ev);
  }

  async remove(id: number, userId: number, role: string): Promise<void> {
    const ev = await this.findOne(id);
    if (ev.organizer.id !== userId && role !== 'admin') {
      throw new ForbiddenException('Нет прав на удаление');
    }
    await this.eventRepo.remove(ev);
  }

  /** Проверка, является ли user участником события */
  async isParticipant(eventId: number, userId: number): Promise<boolean> {
    const ev = await this.eventRepo
      .createQueryBuilder('e')
      .leftJoin('e.participants', 'p')
      .where('e.id = :eventId', { eventId })
      .andWhere('p.id = :userId', { userId })
      .getOne();
    return !!ev;
  }
}
