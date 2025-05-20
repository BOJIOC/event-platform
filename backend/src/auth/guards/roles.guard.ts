import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(ROLES_KEY, ctx.getHandler());
    if (!requiredRoles) {
      return true;
    }

    const req = ctx.switchToHttp().getRequest();
    const user = req.user;
    console.log('RolesGuard user:', user, 'requiredRoles:', requiredRoles); // Лог для проверки

    if (!user) {
      throw new UnauthorizedException('Требуется авторизация');
    }

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Недостаточно прав');
    }

    return true;
  }
}
