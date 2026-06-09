import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InsightStatus, Prisma } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

export type InsightStatusFilter = 'new' | 'viewed' | 'applied' | 'dismissed' | 'all';

@Injectable()
export class InsightsService {
  constructor(private prisma: PrismaService) {}

  async list(userId: string, filter: InsightStatusFilter = 'new') {
    const businessIds = await this.userBusinessIds(userId);
    if (businessIds.length === 0) return { items: [], counts: this.emptyCounts() };

    const where: Prisma.InsightWhereInput = { businessId: { in: businessIds } };
    if (filter !== 'all') {
      where.status = filter.toUpperCase() as InsightStatus;
    }

    const [items, counts] = await Promise.all([
      this.prisma.insight.findMany({
        where,
        orderBy: [{ weekOf: 'desc' }, { severity: 'desc' }, { createdAt: 'desc' }],
        take: 50,
      }),
      this.statusCounts(businessIds),
    ]);

    return { items, counts };
  }

  async apply(userId: string, id: string) {
    await this.assertOwnership(userId, id);
    return this.prisma.insight.update({
      where: { id },
      data: { status: InsightStatus.APPLIED },
    });
  }

  async dismiss(userId: string, id: string) {
    await this.assertOwnership(userId, id);
    return this.prisma.insight.update({
      where: { id },
      data: { status: InsightStatus.DISMISSED },
    });
  }

  async markViewed(userId: string, id: string) {
    const insight = await this.assertOwnership(userId, id);
    if (insight.status !== InsightStatus.NEW) return insight;
    return this.prisma.insight.update({
      where: { id },
      data: { status: InsightStatus.VIEWED },
    });
  }

  private async assertOwnership(userId: string, id: string) {
    const insight = await this.prisma.insight.findUnique({ where: { id } });
    if (!insight) throw new NotFoundException('Insight not found');
    const owned = await this.prisma.business.findFirst({
      where: { id: insight.businessId, userId },
      select: { id: true },
    });
    if (!owned) throw new ForbiddenException();
    return insight;
  }

  private async userBusinessIds(userId: string): Promise<string[]> {
    const rows = await this.prisma.business.findMany({
      where: { userId },
      select: { id: true },
    });
    return rows.map((r) => r.id);
  }

  private async statusCounts(businessIds: string[]) {
    const grouped = await this.prisma.insight.groupBy({
      by: ['status'],
      where: { businessId: { in: businessIds } },
      _count: { _all: true },
    });
    const counts = this.emptyCounts();
    for (const row of grouped) {
      counts[row.status.toLowerCase() as Lowercase<InsightStatus>] = row._count._all;
    }
    return counts;
  }

  private emptyCounts() {
    return { new: 0, viewed: 0, applied: 0, dismissed: 0 };
  }
}
