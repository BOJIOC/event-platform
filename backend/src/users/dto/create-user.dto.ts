import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

/**
 * CreateUserDto для POST /users — регистрация нового аккаунта.
 * Проверяет корректность email, минимальную длину пароля и не пустое имя.
 */
export class CreateUserDto {
  @ApiProperty({ description: 'Имя и фамилия пользователя' })
  @IsString()
  @MinLength(2, { message: 'Имя должно быть не короче 2 символов' })
  name: string;

  @ApiProperty({ description: 'Email для входа' })
  @IsEmail({}, { message: 'Неверный формат email' })
  email: string;

  @ApiProperty({ description: 'Пароль (минимум 6 символов)' })
  @IsString()
  @MinLength(6, { message: 'Пароль должен быть не короче 6 символов' })
  password: string;
}
