import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

/**
 * CreateEventDto описывает, какие поля обязательны при создании нового события.
 * ValidationPipe автоматически проверит эти правила и вернёт 400, если что-то не так.
 */
export class CreateEventDto {
  @ApiProperty({ description: 'Название мероприятия' })
  @IsString()
  @IsNotEmpty({ message: 'Заголовок события не должен быть пустым' })
  title: string;

  @ApiProperty({ description: 'Подробное описание события' })
  @IsString()
  @IsNotEmpty({ message: 'Описание обязательно' })
  description: string;

  @ApiProperty({ description: 'Дата и время в формате ISO 8601' })
  @IsDateString({}, { message: 'Дата должна быть в формате ISO YYYY-MM-DDThh:mm:ssZ' })
  date: string;
}

