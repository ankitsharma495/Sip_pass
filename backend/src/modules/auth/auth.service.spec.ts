import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { RedisService } from '../../redis/redis.service';
import { OTP_PROVIDER } from './interfaces/otp-provider.interface';
import { UserRole } from '@prisma/client';

describe('AuthService', () => {
  let service: AuthService;

  const usersService = {
    findByPhone: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    updateRefreshToken: jest.fn(),
    getDefaultCityId: jest.fn(),
  };

  const redisService = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  };

  const jwtService = {
    signAsync: jest.fn(),
    verify: jest.fn(),
  };

  const configService = {
    get: jest.fn(),
  };

  const otpProvider = {
    sendOtp: jest.fn(),
  };

  const mockUser = {
    id: 'user-uuid-1',
    phone: '+919820451290',
    fullName: 'Aarav Mehta',
    avatarUrl: null,
    cityId: 'city-blr-01',
    role: UserRole.CUSTOMER,
    isActive: true,
    refreshTokenHash: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    usersService.getDefaultCityId.mockResolvedValue('city-blr-01');

    jwtService.signAsync.mockImplementation((payload: any) =>
      Promise.resolve(payload.sub ? 'mock.jwt.token' : 'mock.refresh.token'),
    );

    configService.get.mockImplementation((key: string, defaultVal: any) => {
      const configMap: Record<string, any> = {
        NODE_ENV: 'test',
        OTP_MOCK_DEFAULT: '4821',
        OTP_EXPIRATION_SECONDS: 300,
        OTP_MAX_ATTEMPTS: 5,
        OTP_TEST_NUMBERS: '+919820451290',
        SMS_PROVIDER: 'fast2sms',
        JWT_ACCESS_SECRET: 'test_access_secret',
        JWT_REFRESH_SECRET: 'test_refresh_secret',
        JWT_ACCESS_EXPIRATION: '15m',
        JWT_REFRESH_EXPIRATION: '7d',
      };
      return configMap[key] ?? defaultVal;
    });

    otpProvider.sendOtp.mockResolvedValue(true);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: RedisService, useValue: redisService },
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: configService },
        { provide: OTP_PROVIDER, useValue: otpProvider },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('normalizePhone', () => {
    it('should prepend +91 to a 10-digit Indian phone number', () => {
      expect(service.normalizePhone('9820451290')).toBe('+919820451290');
    });

    it('should strip whitespace and hyphens', () => {
      expect(service.normalizePhone('98204 51290')).toBe('+919820451290');
      expect(service.normalizePhone('+91 98204-51290')).toBe('+919820451290');
    });

    it('should leave an already normalized +91 number intact', () => {
      expect(service.normalizePhone('+919820451290')).toBe('+919820451290');
    });
  });

  describe('requestOtp', () => {
    it('should use default mock OTP for configured test numbers', async () => {
      redisService.get.mockResolvedValue(null);

      const result = await service.requestOtp({ phone: '9820451290' });

      expect(result.phone).toBe('+919820451290');
      expect(result.expiresIn).toBe(300);
      expect(redisService.set).toHaveBeenCalledWith(
        'otp:+919820451290',
        '4821',
        300,
      );
      expect(otpProvider.sendOtp).toHaveBeenCalledWith(
        '+919820451290',
        '4821',
      );
    });

    it('should generate a dynamic random 4-digit OTP for non-test numbers', async () => {
      redisService.get.mockResolvedValue(null);

      const result = await service.requestOtp({ phone: '+919988776655' });

      expect(result.phone).toBe('+919988776655');
      expect(otpProvider.sendOtp).toHaveBeenCalled();
      const dispatchedCode = otpProvider.sendOtp.mock.calls[0][1];
      expect(dispatchedCode).toMatch(/^\d{4}$/);
    });

    it('should throw BadRequestException when rate limit is exceeded', async () => {
      redisService.get.mockResolvedValue('5');

      await expect(
        service.requestOtp({ phone: '9820451290' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('verifyOtp', () => {
    it('should throw UnauthorizedException if OTP is not in redis or expired', async () => {
      redisService.get.mockResolvedValue(null);

      await expect(
        service.verifyOtp({ phone: '+919820451290', otp: '4821' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if OTP does not match', async () => {
      redisService.get.mockResolvedValue('4821');

      await expect(
        service.verifyOtp({ phone: '+919820451290', otp: '9999' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should create a new user with cityId if user does not exist', async () => {
      redisService.get.mockResolvedValue('4821');
      usersService.findByPhone.mockResolvedValue(null);
      usersService.create.mockResolvedValue(mockUser as any);

      const result = await service.verifyOtp({
        phone: '+919820451290',
        otp: '4821',
        cityId: 'city-blr-01',
      });

      expect(usersService.create).toHaveBeenCalledWith({
        phone: '+919820451290',
        cityId: 'city-blr-01',
        fullName: 'Coffee Lover',
      });
      expect(redisService.del).toHaveBeenCalledWith('otp:+919820451290');
      expect(usersService.updateRefreshToken).toHaveBeenCalled();
      expect(result.user.phone).toBe('+919820451290');
      expect(result.accessToken).toBeDefined();
    });

    it('should log in existing active user and update refresh token hash', async () => {
      redisService.get.mockResolvedValue('4821');
      usersService.findByPhone.mockResolvedValue(mockUser as any);

      const result = await service.verifyOtp({
        phone: '+919820451290',
        otp: '4821',
      });

      expect(usersService.create).not.toHaveBeenCalled();
      expect(usersService.updateRefreshToken).toHaveBeenCalled();
      expect(result.user.id).toBe(mockUser.id);
    });
  });

  describe('refreshToken', () => {
    it('should throw UnauthorizedException if token verification fails', async () => {
      jwtService.verify.mockImplementation(() => {
        throw new Error('jwt expired');
      });

      await expect(
        service.refreshToken({ refreshToken: 'invalid.token' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should rotate tokens when refresh token matches hash', async () => {
      const plainToken = 'valid.refresh.token';
      const hash = await bcrypt.hash(plainToken, 10);
      jwtService.verify.mockReturnValue({ sub: mockUser.id });
      usersService.findById.mockResolvedValue({
        ...mockUser,
        refreshTokenHash: hash,
      } as any);

      const result = await service.refreshToken({ refreshToken: plainToken });

      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(usersService.updateRefreshToken).toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should clear refresh token hash in database', async () => {
      const result = await service.logout('user-uuid-1');

      expect(usersService.updateRefreshToken).toHaveBeenCalledWith(
        'user-uuid-1',
        null,
      );
      expect(result.message).toContain('Successfully logged out');
    });
  });
});
