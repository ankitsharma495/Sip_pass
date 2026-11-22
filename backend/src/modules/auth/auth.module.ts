import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { OTP_PROVIDER } from './interfaces/otp-provider.interface';
import { MockOtpProvider } from './providers/mock-otp.provider';
import { Fast2SmsProvider } from './providers/fast2sms.provider';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>(
          'JWT_ACCESS_SECRET',
          'sipclub_access_secret_super_secure_key_2026_dev',
        ),
        signOptions: {
          expiresIn: configService.get<string>('JWT_ACCESS_EXPIRATION', '15m'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    MockOtpProvider,
    Fast2SmsProvider,
    {
      provide: OTP_PROVIDER,
      useFactory: (configService: ConfigService, fast2sms: Fast2SmsProvider, mock: MockOtpProvider) => {
        const provider = configService.get<string>('SMS_PROVIDER', 'fast2sms');
        if (provider === 'mock') {
          return mock;
        }
        return fast2sms;
      },
      inject: [ConfigService, Fast2SmsProvider, MockOtpProvider],
    },
  ],
  exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule {}
