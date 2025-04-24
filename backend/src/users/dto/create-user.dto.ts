import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  password: string;

  @ApiPropertyOptional({ enum: ['user', 'admin'], default: 'user' })
  role?: 'user' | 'admin';
}
