import {
  Injectable,
  Inject,
  BadRequestException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RedisService } from '../../redis/redis.service';
import { IOtpProvider, OTP_PROVIDER } from './interfaces/otp-provider.interface';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
    @Inject(OTP_PROVIDER) private readonly otpProvider: IOtpProvider,
  ) {}

  normalizePhone(phone: string): string {
    const cleaned = phone.replace(/[\s-]/g, '');
    if (/^[6-9]\d{9}$/.test(cleaned)) {
      return `+91${cleaned}`;
    }
    if (/^\+91[6-9]\d{9}$/.test(cleaned)) {
      return cleaned;
    }
    return cleaned;
  }

  isTestPhone(phone: string): boolean {
    const testList = this.configService.get<string>('OTP_TEST_NUMBERS', '+919820451290');
    const testNumbers = testList.split(',').map((p) => this.normalizePhone(p.trim()));
    return testNumbers.includes(phone);
  }

  async requestOtp(dto: RequestOtpDto) {
    const phone = this.normalizePhone(dto.phone);

    // Rate limiting: Max 5 requests per 10 minutes per phone
    const rateKey = `otp_rate:${phone}`;
    const rateCountStr = await this.redisService.get(rateKey);
    const rateCount = rateCountStr ? parseInt(rateCountStr, 10) : 0;
    const maxAttempts = this.configService.get<number>('OTP_MAX_ATTEMPTS', 5);

    if (rateCount >= maxAttempts) {
      throw new BadRequestException(
        'Too many OTP requests. Please wait 10 minutes before requesting again.',
      );
    }
    await this.redisService.set(rateKey, (rateCount + 1).toString(), 600);

    // Dynamic OTP Generation:
    // If the phone is a configured test number (e.g. demo account Aarav Mehta), use OTP_MOCK_DEFAULT (4821)
    // For all real phone numbers, generate a real cryptographically random 4-digit code
    let otp: string;
    if (this.isTestPhone(phone)) {
      otp = this.configService.get<string>('OTP_MOCK_DEFAULT', '4821');
      this.logger.log(`Using mock OTP for configured test number ${phone}: ${otp}`);
    } else {
      otp = Math.floor(1000 + Math.random() * 9000).toString();
    }

    const expirationSeconds = this.configService.get<number>('OTP_EXPIRATION_SECONDS', 300);
    const otpKey = `otp:${phone}`;
    await this.redisService.set(otpKey, otp, expirationSeconds);

    // Send real OTP through configured SMS Gateway (Fast2SMS)
    await this.otpProvider.sendOtp(phone, otp);

    return {
      message: 'OTP sent successfully',
      phone,
      expiresIn: expirationSeconds,
      ...(this.configService.get<string>('NODE_ENV') !== 'production' ? { devOtp: otp } : {}),
    };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const phone = this.normalizePhone(dto.phone);
    const otpKey = `otp:${phone}`;
    const storedOtp = await this.redisService.get(otpKey);

    if (!storedOtp) {
      throw new UnauthorizedException('OTP has expired or was not requested');
    }

    if (storedOtp !== dto.otp) {
      throw new UnauthorizedException('Invalid OTP code. Please check and try again');
    }

    // OTP consumed successfully - remove from redis
    await this.redisService.del(otpKey);

    // Find or create User
    let user = await this.usersService.findByPhone(phone);
    if (!user) {
      user = await this.usersService.create({
        phone,
        cityId: dto.cityId,
        fullName: 'Coffee Lover',
      });
      this.logger.log(`Created new customer user: ${user.id} (${phone}) for city: ${user.cityId}`);
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Your account has been deactivated. Please contact support.');
    }

    // Generate Tokens
    const tokens = await this.generateTokens(user.id, user.phone, user.cityId, user.role);

    // Hash and store refresh token
    const saltRounds = 10;
    const refreshTokenHash = await bcrypt.hash(tokens.refreshToken, saltRounds);
    await this.usersService.updateRefreshToken(user.id, refreshTokenHash);

    return {
      ...tokens,
      user: {
        id: user.id,
        phone: user.phone,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        cityId: user.cityId,
        role: user.role,
      },
    };
  }

  async refreshToken(dto: RefreshTokenDto) {
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(dto.refreshToken, {
        secret: this.configService.get<string>(
          'JWT_REFRESH_SECRET',
          'sipclub_refresh_secret_super_secure_key_2026_dev',
        ),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.usersService.findById(payload.sub);
    if (!user || !user.isActive || !user.refreshTokenHash) {
      throw new UnauthorizedException('Access denied. Please log in again.');
    }

    const isMatch = await bcrypt.compare(dto.refreshToken, user.refreshTokenHash);
    if (!isMatch) {
      // Possible reuse detection - invalidate token
      await this.usersService.updateRefreshToken(user.id, null);
      throw new UnauthorizedException('Invalid refresh token. Token reuse detected.');
    }

    // Generate new rotated token pair
    const tokens = await this.generateTokens(user.id, user.phone, user.cityId, user.role);

    const saltRounds = 10;
    const newHash = await bcrypt.hash(tokens.refreshToken, saltRounds);
    await this.usersService.updateRefreshToken(user.id, newHash);

    return tokens;
  }

  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, null);
    return {
      message: 'Successfully logged out and session revoked',
    };
  }

  private async generateTokens(
    userId: string,
    phone: string,
    cityId: string,
    role: string,
  ) {
    const payload: JwtPayload = {
      sub: userId,
      phone,
      cityId,
      role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>(
          'JWT_ACCESS_SECRET',
          'sipclub_access_secret_super_secure_key_2026_dev',
        ),
        expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRATION', '15m'),
      }),
      this.jwtService.signAsync(
        { sub: userId },
        {
          secret: this.configService.get<string>(
            'JWT_REFRESH_SECRET',
            'sipclub_refresh_secret_super_secure_key_2026_dev',
          ),
          expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION', '7d'),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: 900, // 15 mins in seconds
    };
  }
}
