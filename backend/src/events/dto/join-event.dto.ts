import { ApiProperty } from '@nestjs/swagger';

export class JoinEventDto {
  @ApiProperty()
  userId: number;
}
