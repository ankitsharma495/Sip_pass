import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);
  const apiPrefix = configService.get<string>('API_PREFIX', 'api/v1');

  // Enable CORS for mobile apps and web admin
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global API Prefix (e.g. /api/v1)
  app.setGlobalPrefix(apiPrefix, {
    exclude: ['health', '/'],
  });

  // Global Validation Pipe with auto-transform and whitelist filtering
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global Exception Filter for standardized error responses
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global Transform Interceptor for unified JSON response wrappers
  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(port);
  logger.log(`☕ SipClub Backend running on: http://localhost:${port}/${apiPrefix}`);
  logger.log(`🩺 Health check endpoint: http://localhost:${port}/health`);
}
bootstrap();
