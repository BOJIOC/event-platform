import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'jwt_secret_key', // Должен совпадать с JwtModule
    });
  }

  validate(payload: any) {
    console.log('JWT VALIDATE', payload); // Лог для дебага
    // возвращаем user-объект для req.user
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}
