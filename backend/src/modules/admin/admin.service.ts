import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { ListBusinessesDto, ListMenusDto, ListUsersDto, UpdateUserDto } from './admin.dto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async stats() {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      totalBusinesses,
      totalMenus,
      totalScans,
      todayScans,
      planGroups,
      newUsers7d,
      recentUsers,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.business.count(),
      this.prisma.menu.count(),
      this.prisma.analytics.count(),
      this.prisma.analytics.count({ where: { createdAt: { gte: startOfToday } } }),
      this.prisma.user.groupBy({ by: ['plan'], _count: { _all: true } }),
      this.prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      this.prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true, email: true, name: true, plan: true, role: true, createdAt: true,
          _count: { select: { businesses: true } },
        },
      }),
    ]);

    const planDistribution = { FREE: 0, PRO: 0, PREMIUM: 0 };
    planGroups.forEach((g) => {
      planDistribution[g.plan] = g._count._all;
    });

    return {
      totalUsers,
      totalBusinesses,
      totalMenus,
      totalScans,
      todayScans,
      newUsers7d,
      planDistribution,
      recentUsers,
    };
  }

  async listUsers(dto: ListUsersDto) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 20;
    const where: Prisma.UserWhereInput = {};

    if (dto.search) {
      where.OR = [
        { email: { contains: dto.search, mode: 'insensitive' } },
        { name: { contains: dto.search, mode: 'insensitive' } },
      ];
    }
    if (dto.plan) where.plan = dto.plan;
    if (dto.role) where.role = dto.role;

    const [items, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          email: true,
          name: true,
          plan: true,
          role: true,
          isActive: true,
          createdAt: true,
          _count: { select: { businesses: true } },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async userDetail(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        plan: true,
        role: true,
        isActive: true,
        planExpiresAt: true,
        locale: true,
        createdAt: true,
        updatedAt: true,
        businesses: {
          select: {
            id: true,
            name: true,
            slug: true,
            isActive: true,
            createdAt: true,
            _count: { select: { menus: true } },
            menus: {
              select: {
                id: true,
                name: true,
                isActive: true,
                themeColor: true,
                _count: { select: { qrCodes: true, analytics: true } },
              },
            },
          },
        },
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    const existing = await this.prisma.user.findUnique({ where: { id }, select: { id: true } });
    if (!existing) throw new NotFoundException('User not found');

    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: {
        id: true, email: true, name: true, plan: true, role: true, isActive: true,
      },
    });
  }

  async listBusinesses(dto: ListBusinessesDto) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 20;
    const where: Prisma.BusinessWhereInput = {};
    if (dto.search) {
      where.OR = [
        { name: { contains: dto.search, mode: 'insensitive' } },
        { slug: { contains: dto.search, mode: 'insensitive' } },
      ];
    }
    const [items, total] = await Promise.all([
      this.prisma.business.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          name: true,
          slug: true,
          phone: true,
          isActive: true,
          createdAt: true,
          user: { select: { id: true, email: true, name: true, plan: true } },
          _count: { select: { menus: true } },
        },
      }),
      this.prisma.business.count({ where }),
    ]);
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async listMenus(dto: ListMenusDto) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 20;
    const where: Prisma.MenuWhereInput = {};
    if (dto.search) where.name = { contains: dto.search, mode: 'insensitive' };
    if (dto.active !== undefined) where.isActive = dto.active;

    const [items, total] = await Promise.all([
      this.prisma.menu.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          name: true,
          isActive: true,
          themeColor: true,
          createdAt: true,
          business: {
            select: {
              id: true,
              name: true,
              slug: true,
              user: { select: { id: true, email: true, name: true } },
            },
          },
          _count: { select: { qrCodes: true, analytics: true, categories: true } },
        },
      }),
      this.prisma.menu.count({ where }),
    ]);
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}
