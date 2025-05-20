import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com', description: 'Email пользователя' })
  @IsEmail({}, { message: 'Неверный формат email' })
  email: string;

  @ApiProperty({ example: 'пароль123', description: 'Пароль пользователя' })
  @IsString({ message: 'Пароль должен быть строкой' })
  password: string;
}
