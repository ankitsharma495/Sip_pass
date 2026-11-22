import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { User, UserRole } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByPhone(phone: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { phone },
      include: { city: true },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: { city: true },
    });
  }

  async getDefaultCityId(): Promise<string> {
    const defaultCity = await this.prisma.city.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' },
    });

    if (defaultCity) {
      return defaultCity.id;
    }

    // Fallback if DB is empty
    return 'city-blr-01';
  }

  async create(data: {
    phone: string;
    cityId?: string;
    fullName?: string;
    avatarUrl?: string;
    role?: UserRole;
  }): Promise<User> {
    let resolvedCityId = data.cityId;
    if (!resolvedCityId) {
      resolvedCityId = await this.getDefaultCityId();
    }

    return this.prisma.user.create({
      data: {
        phone: data.phone,
        cityId: resolvedCityId,
        fullName: data.fullName || 'Coffee Lover',
        avatarUrl: data.avatarUrl,
        role: data.role || UserRole.CUSTOMER,
      },
      include: { city: true },
    });
  }

  async updateRefreshToken(userId: string, refreshTokenHash: string | null): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash },
    });
  }
}
