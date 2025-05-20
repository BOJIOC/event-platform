import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { ParticipantGuard } from './guards/participant.guard';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [
    UsersModule,
    EventsModule,         // чтобы инжектить EventsService в ParticipantGuard
    PassportModule,
    JwtModule.register({
      secret: 'jwt_secret_key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [AuthService, JwtStrategy, ParticipantGuard],
  controllers: [AuthController],
  exports: [ParticipantGuard],
})
export class AuthModule {}
