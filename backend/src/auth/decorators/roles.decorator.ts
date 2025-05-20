// src/auth/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';

// ключ метаданных, на который ссылается RolesGuard
export const ROLES_KEY = 'roles';

/**
 * @Roles('admin','user') 
 *   — вешает на обработчик метаданные [{ roles: ['admin','user'] }]
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
