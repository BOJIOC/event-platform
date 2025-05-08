import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { Comment } from './comment.entity';
import { UsersModule } from '../users/users.module';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment]),
    UsersModule,
    EventsModule,       // ← чтобы в CommentsService можно было инжектить EventsService
  ],
  providers: [CommentsService],
  controllers: [CommentsController],
})
export class CommentsModule {}
