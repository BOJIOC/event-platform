import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule }      from '@nestjs/typeorm';
import { EventsService }      from './events.service';
import { EventsController }   from './events.controller';
import { Event }              from './event.entity';
import { UsersModule }        from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event]),
    forwardRef(() => UsersModule),
  ],
  controllers: [EventsController],
  providers:   [EventsService],
  exports:     [EventsService],
})
export class EventsModule {}
