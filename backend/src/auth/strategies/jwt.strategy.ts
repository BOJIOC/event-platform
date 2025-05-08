import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'jwt_secret_key',            // совпадает с jwtModule.register
    });
  }

  async validate(payload: any) {
    // payload содержит { sub, email, role }
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
