import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { Comment } from './comment.entity';
import { EventsModule } from '../events/events.module';
import { UsersModule } from '../users/users.module';

/**
 * CommentsModule объединяет логику комментариев:
 * - проверка события через EventsModule
 * - проверка автора через UsersModule
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Comment]),
    forwardRef(() => EventsModule),
    forwardRef(() => UsersModule),
  ],
  providers: [CommentsService],
  controllers: [CommentsController],
})
export class CommentsModule {}
