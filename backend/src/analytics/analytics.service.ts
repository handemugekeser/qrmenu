import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DeviceType } from '@prisma/client';
import { Request } from 'express';
import { TrackEventDto } from './dto/track-event.dto';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async recordEvent(dto: TrackEventDto, userAgent?: string) {
    return this.prisma.analyticsEvent.create({
      data: {
        businessId: dto.businessId,
        menuId: dto.menuId,
        type: dto.type,
        itemId: dto.itemId,
        categoryId: dto.categoryId,
        language: dto.language,
        sessionId: dto.sessionId,
        tableNumber: dto.tableNumber,
        userAgent,
        metadata: dto.metadata as any,
      },
    });
  }

  async track(menuId: string, req: Request, tableNumber?: number) {
    const userAgent = req.headers['user-agent'] || '';
    const deviceType = this.detectDevice(userAgent);
    const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.ip;

    return this.prisma.analytics.create({
      data: { menuId, deviceType, userAgent, ipAddress, tableNumber },
    });
  }

  async getSummary(menuId: string, userId: string) {
    const menu = await this.prisma.menu.findFirst({
      where: { id: menuId, business: { userId } },
    });
    if (!menu) return null;

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [total, last30, last7, byDevice, dailyViews] = await Promise.all([
      this.prisma.analytics.count({ where: { menuId } }),
      this.prisma.analytics.count({ where: { menuId, createdAt: { gte: thirtyDaysAgo } } }),
      this.prisma.analytics.count({ where: { menuId, createdAt: { gte: sevenDaysAgo } } }),
      this.prisma.analytics.groupBy({
        by: ['deviceType'],
        where: { menuId },
        _count: { deviceType: true },
      }),
      this.prisma.$queryRaw<{ date: string; count: number }[]>`
        SELECT DATE(created_at)::text as date, COUNT(*)::int as count
        FROM analytics
        WHERE menu_id = ${menuId}
          AND created_at >= ${thirtyDaysAgo}
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `,
    ]);

    return {
      total,
      last30Days: last30,
      last7Days: last7,
      byDevice: byDevice.map((d) => ({
        device: d.deviceType,
        count: d._count.deviceType,
      })),
      dailyViews,
    };
  }

  async getBusinessAnalytics(businessId: string, userId: string) {
    const business = await this.prisma.business.findFirst({
      where: { id: businessId, userId },
      include: { menus: { select: { id: true, name: true } } },
    });
    if (!business) return null;

    const menuIds = business.menus.map((m) => m.id);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [total, last30, byMenu] = await Promise.all([
      this.prisma.analytics.count({ where: { menuId: { in: menuIds } } }),
      this.prisma.analytics.count({ where: { menuId: { in: menuIds }, createdAt: { gte: thirtyDaysAgo } } }),
      this.prisma.analytics.groupBy({
        by: ['menuId'],
        where: { menuId: { in: menuIds } },
        _count: { menuId: true },
      }),
    ]);

    const menuMap = Object.fromEntries(business.menus.map((m) => [m.id, m.name]));

    return {
      total,
      last30Days: last30,
      byMenu: byMenu.map((m) => ({
        menuId: m.menuId,
        menuName: menuMap[m.menuId],
        count: m._count.menuId,
      })),
    };
  }

  private detectDevice(ua: string): DeviceType {
    if (!ua) return DeviceType.UNKNOWN;
    if (/tablet|ipad|playbook|silk/i.test(ua)) return DeviceType.TABLET;
    if (/mobile|iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(ua)) return DeviceType.MOBILE;
    return DeviceType.DESKTOP;
  }
}
