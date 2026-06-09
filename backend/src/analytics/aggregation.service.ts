import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AnalyticsEventType, Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

type TopItem = { itemId: string; name: string; views: number };
type TopCategory = { categoryId: string; name: string; views: number };

@Injectable()
export class AggregationService {
  private readonly logger = new Logger(AggregationService.name);

  constructor(private prisma: PrismaService) {}

  @Cron('0 1 * * *')
  async generateDailySnapshots(targetDate?: Date) {
    const day = targetDate ? new Date(targetDate) : new Date(Date.now() - 24 * 60 * 60 * 1000);
    const dayStart = new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate()));
    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

    const businessGroups = await this.prisma.analyticsEvent.groupBy({
      by: ['businessId'],
      where: { timestamp: { gte: dayStart, lt: dayEnd } },
      _count: { _all: true },
    });

    this.logger.log(
      `Aggregating ${businessGroups.length} business(es) for ${dayStart.toISOString().slice(0, 10)}`,
    );

    let written = 0;
    for (const grp of businessGroups) {
      try {
        await this.buildSnapshotFor(grp.businessId, dayStart, dayEnd);
        written++;
      } catch (err) {
        this.logger.error(`Snapshot failed for ${grp.businessId}: ${(err as Error).message}`);
      }
    }
    return { date: dayStart.toISOString().slice(0, 10), businesses: written };
  }

  private async buildSnapshotFor(businessId: string, dayStart: Date, dayEnd: Date) {
    const where = { businessId, timestamp: { gte: dayStart, lt: dayEnd } };

    const [totalScans, uniqueSessionRows, itemAgg, categoryAgg, langAgg, sessions] = await Promise.all([
      this.prisma.analyticsEvent.count({ where: { ...where, type: AnalyticsEventType.SCAN_OPEN } }),
      this.prisma.analyticsEvent.findMany({
        where,
        distinct: ['sessionId'],
        select: { sessionId: true },
      }),
      this.prisma.analyticsEvent.groupBy({
        by: ['itemId'],
        where: { ...where, type: AnalyticsEventType.ITEM_VIEW, itemId: { not: null } },
        _count: { _all: true },
        orderBy: { _count: { itemId: 'desc' } },
        take: 10,
      }),
      this.prisma.analyticsEvent.groupBy({
        by: ['categoryId'],
        where: { ...where, type: AnalyticsEventType.CATEGORY_VIEW, categoryId: { not: null } },
        _count: { _all: true },
        orderBy: { _count: { categoryId: 'desc' } },
        take: 10,
      }),
      this.prisma.analyticsEvent.groupBy({
        by: ['language'],
        where: {
          ...where,
          type: { in: [AnalyticsEventType.SCAN_OPEN, AnalyticsEventType.LANGUAGE_CHANGE] },
          language: { not: null },
        },
        _count: { _all: true },
      }),
      this.prisma.analyticsEvent.findMany({
        where,
        select: { sessionId: true, timestamp: true },
        orderBy: { timestamp: 'asc' },
      }),
    ]);

    const itemIds = itemAgg.map((r) => r.itemId).filter(Boolean) as string[];
    const categoryIds = categoryAgg.map((r) => r.categoryId).filter(Boolean) as string[];
    const [products, categories] = await Promise.all([
      itemIds.length
        ? this.prisma.product.findMany({ where: { id: { in: itemIds } }, select: { id: true, name: true } })
        : Promise.resolve([] as { id: string; name: string }[]),
      categoryIds.length
        ? this.prisma.category.findMany({ where: { id: { in: categoryIds } }, select: { id: true, name: true } })
        : Promise.resolve([] as { id: string; name: string }[]),
    ]);
    const productName = new Map(products.map((p) => [p.id, p.name]));
    const categoryName = new Map(categories.map((c) => [c.id, c.name]));

    const topItems: TopItem[] = itemAgg.map((r) => ({
      itemId: r.itemId as string,
      name: productName.get(r.itemId as string) || '',
      views: r._count._all,
    }));

    const topCategories: TopCategory[] = categoryAgg.map((r) => ({
      categoryId: r.categoryId as string,
      name: categoryName.get(r.categoryId as string) || '',
      views: r._count._all,
    }));

    const languageDist: Record<string, number> = {};
    for (const row of langAgg) {
      if (row.language) languageDist[row.language] = (languageDist[row.language] || 0) + row._count._all;
    }

    const hourlyDist = new Array(24).fill(0);
    for (const row of sessions) {
      hourlyDist[row.timestamp.getUTCHours()]++;
    }

    const sessionSpans = new Map<string, { first: number; last: number }>();
    for (const row of sessions) {
      const ts = row.timestamp.getTime();
      const cur = sessionSpans.get(row.sessionId);
      if (!cur) sessionSpans.set(row.sessionId, { first: ts, last: ts });
      else cur.last = ts;
    }
    let avgSessionMs = 0;
    if (sessionSpans.size > 0) {
      let totalMs = 0;
      for (const span of sessionSpans.values()) totalMs += span.last - span.first;
      avgSessionMs = Math.round(totalMs / sessionSpans.size);
    }

    const data = {
      totalScans,
      uniqueSessions: uniqueSessionRows.length,
      topItems: topItems as unknown as Prisma.InputJsonValue,
      topCategories: topCategories as unknown as Prisma.InputJsonValue,
      languageDist: languageDist as unknown as Prisma.InputJsonValue,
      hourlyDist: hourlyDist as unknown as Prisma.InputJsonValue,
      avgSessionMs,
    };

    return this.prisma.dailySnapshot.upsert({
      where: { businessId_date: { businessId, date: dayStart } },
      create: { businessId, date: dayStart, ...data },
      update: data,
    });
  }
}
