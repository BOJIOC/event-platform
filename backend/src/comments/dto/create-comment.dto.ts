// src/comments/dto/create-comment.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty()
  content: string;
}
