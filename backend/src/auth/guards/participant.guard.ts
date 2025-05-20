// src/auth/guards/participant.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { EventsService } from '../../events/events.service';

@Injectable()
export class ParticipantGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private eventsService: EventsService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const userId = req.user?.id;
    const eventId = parseInt(req.params.id, 10) || req.body.eventId;

    if (!userId || !eventId) {
      throw new ForbiddenException('Нет доступа к событию');
    }

    const ok = await this.eventsService.isParticipant(eventId, userId);
    if (!ok) {
      throw new ForbiddenException('Вы не участник этого события');
    }
    return true;
  }
}
