import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { Event } from './event.entity';
import { UsersModule } from '../users/users.module';

/**
 * EventsModule объединяет всё, что нужно для работы с мероприятиями:
 * - EventEntity — определение таблицы событий в БД
 * - EventsService — бизнес-логика (CRUD, фильтрация, join/unjoin)
 * - EventsController — HTTP-интерфейс (эндпоинты GET/POST/PATCH/DELETE)
 * - интеграция с UsersModule — чтобы проверять права организатора
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Event]),      // регистрируем репозиторий Event
    forwardRef(() => UsersModule),         // для связи «организатор» и «участник»
  ],
  providers: [EventsService],              // доступен через DI
  controllers: [EventsController],         // обрабатывает HTTP-запросы
  exports: [EventsService],                // чтобы другие модули могли вызывать логику событий
})
export class EventsModule {}
