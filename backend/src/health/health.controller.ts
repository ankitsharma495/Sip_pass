import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

@Controller('health')
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  @Get()
  async check() {
    let dbStatus = 'healthy';
    let redisStatus = 'healthy';

    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      dbStatus = 'degraded_or_disconnected';
    }

    try {
      const redisHealthy = await this.redis.isHealthy();
      if (!redisHealthy) {
        redisStatus = 'degraded';
      }
    } catch {
      redisStatus = 'degraded';
    }

    return {
      status: dbStatus === 'healthy' && redisStatus === 'healthy' ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        database: dbStatus,
        redis: redisStatus,
      },
    };
  }
}
