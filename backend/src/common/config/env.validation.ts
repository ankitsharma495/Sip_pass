import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

enum SmsProviderType {
  Fast2Sms = 'fast2sms',
  Mock = 'mock',
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment = Environment.Development;

  @IsNumber()
  @IsOptional()
  PORT: number = 3000;

  @IsString()
  @IsOptional()
  API_PREFIX: string = 'api/v1';

  @IsString()
  DATABASE_URL: string;

  @IsString()
  @IsOptional()
  REDIS_HOST: string = 'localhost';

  @IsNumber()
  @IsOptional()
  REDIS_PORT: number = 6380;

  @IsString()
  @IsOptional()
  REDIS_PASSWORD?: string;

  @IsString()
  JWT_ACCESS_SECRET: string;

  @IsString()
  @IsOptional()
  JWT_ACCESS_EXPIRATION: string = '15m';

  @IsString()
  JWT_REFRESH_SECRET: string;

  @IsString()
  @IsOptional()
  JWT_REFRESH_EXPIRATION: string = '7d';

  @IsNumber()
  @IsOptional()
  THROTTLE_TTL: number = 60000;

  @IsNumber()
  @IsOptional()
  THROTTLE_LIMIT: number = 30;

  @IsNumber()
  @IsOptional()
  OTP_EXPIRATION_SECONDS: number = 300;

  @IsString()
  @IsOptional()
  OTP_MOCK_DEFAULT: string = '4821';

  @IsString()
  @IsOptional()
  OTP_TEST_NUMBERS?: string = '+919820451290';

  @IsEnum(SmsProviderType)
  @IsOptional()
  SMS_PROVIDER: SmsProviderType = SmsProviderType.Fast2Sms;

  @IsString()
  @IsOptional()
  FAST2SMS_API_KEY?: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
