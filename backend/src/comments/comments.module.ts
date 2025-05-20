import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { EventsModule } from '../events/events.module';
import { User } from '../users/user.entity';

@Module({
  imports: [
    // регистрируем репозитории для Comment и User
    TypeOrmModule.forFeature([Comment, User]),
    // чтобы была возможность инжектить EventsService
    EventsModule,
  ],
  providers: [CommentsService],
  controllers: [CommentsController],
  exports: [CommentsService],
})
export class CommentsModule {}
