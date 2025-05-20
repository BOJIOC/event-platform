// src/users/dto/create-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Иван Иванов', description: 'Имя пользователя' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'user@example.com', description: 'Email пользователя' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'пароль123', description: 'Пароль пользователя' })
  @IsString()
  @MinLength(6)
  password: string;
}
