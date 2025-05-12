import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

/**
 * CreateCommentDto определяет, что при добавлении комментария
 * обязательным полем является content — строка не пустая.
 */
export class CreateCommentDto {
  @ApiProperty({ description: 'Текст комментария' })
  @IsString()
  @IsNotEmpty({ message: 'Комментарий не может быть пустым' })
  content: string;
}
