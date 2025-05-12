import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Создаёт нового пользователя:
   * - Хэширует пароль (bcrypt, 10 раундов)
   * - Сохраняет в БД
   */
  async create(dto: CreateUserDto): Promise<User> {
    const hash = await bcrypt.hash(dto.password, 10);
    const user = this.userRepository.create({ ...dto, password: hash });
    return this.userRepository.save(user);
  }

  /**
   * Находит пользователя по email.
   * Бросает NotFoundException, если не найден.
   */
  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException(`User with email=${email} not found`);
    return user;
  }

  /**
   * Возвращает пользователя по ID.
   */
  async findOne(id: number): Promise<User> {
    return this.userRepository.findOneOrFail({ where: { id } });
  }
}
