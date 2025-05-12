import {
  Controller, Post, Get, Param, Body,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

/**
 * UsersController предоставляет:
 * POST /users    — регистрация
 * GET  /users    — список всех пользователей (для админа)
 * GET  /users/:id — профиль по ID
 */
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /** Регистрация нового пользователя */
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  /** Получить всех (не обязательно включать в публичный API) */
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  /** Профиль по ID */
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(+id);
  }
}
