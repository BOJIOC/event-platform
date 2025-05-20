import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { Event } from './event.entity';
import { User } from '../users/user.entity';  // ← подключаем сущность User

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, User]),  // ← репозитории Event и User
  ],
  providers: [EventsService],
  controllers: [EventsController],
  exports: [EventsService],
})
export class EventsModule {}
