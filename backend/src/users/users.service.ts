import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /** Создаёт пользователя, хешируя пароль */
  async create(dto: CreateUserDto): Promise<User> {
    const exists = await this.userRepository.findOne({ where: { email: dto.email } });
    if (exists) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }
    const hash = await bcrypt.hash(dto.password, 10);
    const user = this.userRepository.create({ ...dto, password: hash });
    return this.userRepository.save(user);
  }

  /** Ищет пользователя по email */
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }
}
