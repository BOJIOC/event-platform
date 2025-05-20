import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    console.log('Trying login for', email, 'with password', password);
    const user = await this.usersService.findByEmail(email);
    console.log('Found user:', user);
    if (user === null) {
      throw new UnauthorizedException('Неправильный email или пароль');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match?', isMatch);
    if (!isMatch) {
      throw new UnauthorizedException('Неправильный email или пароль');
    }

    // Теперь user точно не null и имеет поле password
    const { password: _, ...result } = user;
    return result;
  }

  async login(user: any): Promise<{ access_token: string }> {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }
}
