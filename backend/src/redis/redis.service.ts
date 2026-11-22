import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis | null = null;
  // In-memory fallback for local dev or testing when Redis is not running
  private readonly memoryStore = new Map<string, { value: string; expiresAt: number }>();

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const host = this.configService.get<string>('REDIS_HOST', 'localhost');
    const port = this.configService.get<number>('REDIS_PORT', 6379);
    const password = this.configService.get<string>('REDIS_PASSWORD');

    try {
      this.client = new Redis({
        host,
        port,
        password: password || undefined,
        retryStrategy: (times) => {
          if (times > 3) {
            this.logger.warn('Redis connection retry limit reached. Using in-memory fallback.');
            return null; // Stop retrying, use fallback
          }
          return Math.min(times * 100, 2000);
        },
        lazyConnect: true,
      });

      this.client
        .connect()
        .then(() => {
          this.logger.log(`Connected to Redis at ${host}:${port}`);
        })
        .catch((err) => {
          this.logger.warn(`Redis connect failed: ${err.message}. Using in-memory fallback.`);
          this.client = null;
        });

      this.client.on('error', (err) => {
        this.logger.warn(`Redis error: ${err.message}. Relying on in-memory fallback.`);
      });
    } catch (e: any) {
      this.logger.warn(`Redis init error: ${e.message}. Using in-memory fallback.`);
      this.client = null;
    }
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.quit();
    }
  }

  async get(key: string): Promise<string | null> {
    if (this.client && this.client.status === 'ready') {
      try {
        return await this.client.get(key);
      } catch {
        // fallback
      }
    }

    const item = this.memoryStore.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
      this.memoryStore.delete(key);
      return null;
    }
    return item.value;
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (this.client && this.client.status === 'ready') {
      try {
        if (ttlSeconds) {
          await this.client.set(key, value, 'EX', ttlSeconds);
        } else {
          await this.client.set(key, value);
        }
        return;
      } catch {
        // fallback
      }
    }

    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : Infinity;
    this.memoryStore.set(key, { value, expiresAt });
  }

  async del(key: string): Promise<void> {
    if (this.client && this.client.status === 'ready') {
      try {
        await this.client.del(key);
        return;
      } catch {
        // fallback
      }
    }
    this.memoryStore.delete(key);
  }

  async isHealthy(): Promise<boolean> {
    if (this.client && this.client.status === 'ready') {
      try {
        const ping = await this.client.ping();
        return ping === 'PONG';
      } catch {
        return false;
      }
    }
    return true; // Memory fallback is always ready
  }
}
