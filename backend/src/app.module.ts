import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { validate } from './common/config/env.validation';
import { PrismaModule } from './common/prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { HealthModule } from './health/health.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    // 1. Env config with strict class-validator schema validation
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
      envFilePath: ['.env', '.env.local'],
    }),

    // 2. Global Rate Limiter
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get<number>('THROTTLE_TTL', 60000),
          limit: config.get<number>('THROTTLE_LIMIT', 30),
        },
      ],
      inject: [ConfigService],
    }),

    // 3. Infrastructure Modules
    PrismaModule,
    RedisModule,
    HealthModule,

    // 4. Domain Modules (Step 1 & 2: Auth and Users)
    UsersModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
