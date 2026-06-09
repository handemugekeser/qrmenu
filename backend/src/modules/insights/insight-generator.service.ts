import { Injectable, Logger, Optional } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AnalyticsEventType, InsightSeverity, Prisma } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { LlmInsightService } from './llm';
import { ALL_RULES } from './rules';
import {
  EventAggregates,
  InsightCandidate,
  InsightRule,
  MenuWithContent,
  RuleContext,
} from './types';
import { buildWeeklySnapshots, startOfIsoWeek } from './weekly-aggregator';

const SEVERITY_RANK: Record<InsightSeverity, number> = {
  IMPORTANT: 3,
  SUGGESTION: 2,
  INFO: 1,
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const DAILY_LOOKBACK_DAYS = 7;
const WEEKLY_LOOKBACK_DAYS = 28;

@Injectable()
export class InsightGeneratorService {
  private readonly logger = new Logger(InsightGeneratorService.name);

  constructor(
    private prisma: PrismaService,
    private llm: LlmInsightService,
    @Optional() private notifications: NotificationsService | null = null,
    @Optional() private rules: InsightRule[] = ALL_RULES,
  ) {}

  @Cron('0 2 * * 1')
  async generateWeeklyInsights(now: Date = new Date()) {
    const weekOf = startOfIsoWeek(now);
    const businesses = await this.prisma.business.findMany({
      where: { isActive: true },
      select: { id: true },
    });

    this.logger.log(`Generating insights for ${businesses.length} business(es), week=${weekOf.toISOString().slice(0, 10)}`);

    let total = 0;
    for (const { id } of businesses) {
      try {
        const written = await this.generateForBusiness(id, weekOf, now);
        total += written;
        if (written > 0) {
          await this.fireNotification(id, weekOf);
        }
      } catch (err) {
        this.logger.error(`Insight generation failed for ${id}: ${(err as Error).message}`);
      }
    }
    return { weekOf, businesses: businesses.length, insights: total };
  }

  async generateForBusiness(businessId: string, weekOf: Date, now: Date = new Date()): Promise<number> {
    const ctx = await this.buildContext(businessId, now);
    if (!ctx) return 0;

    let written = 0;
    for (const rule of this.rules) {
      const candidate = safeEvaluate(rule, ctx, this.logger);
      if (!candidate) continue;
      const saved = await this.persist(businessId, weekOf, candidate);
      if (saved) written++;
    }
    return written;
  }

  private async fireNotification(businessId: string, weekOf: Date) {
    if (!this.notifications) return;
    const fresh = await this.prisma.insight.findMany({
      where: { businessId, weekOf },
      select: { title: true, body: true, severity: true, createdAt: true },
    });
    if (fresh.length === 0) return;

    const top = [...fresh].sort((a, b) => {
      const diff = SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity];
      if (diff !== 0) return diff;
      return b.createdAt.getTime() - a.createdAt.getTime();
    })[0];

    try {
      await this.notifications.sendWeeklyInsightsReady({
        businessId,
        count: fresh.length,
        topInsight: { title: top.title, body: top.body },
      });
    } catch (err) {
      this.logger.error(`notify failed for ${businessId}: ${(err as Error).message}`);
    }
  }

  private async buildContext(businessId: string, now: Date): Promise<RuleContext | null> {
    const business = await this.prisma.business.findUnique({ where: { id: businessId } });
    if (!business) return null;

    const menu = await this.prisma.menu.findFirst({
      where: { businessId, isDefault: true },
      include: {
        categories: {
          include: {
            translations: true,
            products: { include: { translations: true } },
          },
        },
      },
    });
    if (!menu) return null;

    const dailyStart = new Date(now.getTime() - DAILY_LOOKBACK_DAYS * MS_PER_DAY);
    const weeklyStart = new Date(now.getTime() - WEEKLY_LOOKBACK_DAYS * MS_PER_DAY);

    const [daily, weeklySource] = await Promise.all([
      this.prisma.dailySnapshot.findMany({
        where: { businessId, date: { gte: dailyStart } },
        orderBy: { date: 'asc' },
      }),
      this.prisma.dailySnapshot.findMany({
        where: { businessId, date: { gte: weeklyStart } },
        orderBy: { date: 'asc' },
      }),
    ]);

    const aggregates = await this.buildAggregates(businessId, weeklyStart, now);
    const weekly = buildWeeklySnapshots(weeklySource);

    return {
      business,
      menu: menu as MenuWithContent,
      daily,
      weekly,
      aggregates,
      now,
    };
  }

  private async buildAggregates(businessId: string, since: Date, until: Date): Promise<EventAggregates> {
    const weekStart = new Date(until.getTime() - 7 * MS_PER_DAY);

    const [sessionEnds, itemEvents, weekItemViews] = await Promise.all([
      this.prisma.analyticsEvent.groupBy({
        by: ['categoryId'],
        where: {
          businessId,
          type: AnalyticsEventType.SESSION_END,
          timestamp: { gte: weekStart, lte: until },
          categoryId: { not: null },
        },
        _count: { _all: true },
      }),
      this.prisma.analyticsEvent.findMany({
        where: {
          businessId,
          timestamp: { gte: weekStart, lte: until },
          sessionId: { not: undefined },
        },
        select: { sessionId: true, type: true, itemId: true, timestamp: true },
        orderBy: [{ sessionId: 'asc' }, { timestamp: 'asc' }],
      }),
      this.prisma.analyticsEvent.groupBy({
        by: ['itemId'],
        where: {
          businessId,
          type: AnalyticsEventType.ITEM_VIEW,
          timestamp: { gte: weekStart, lte: until },
          itemId: { not: null },
        },
        _count: { _all: true },
      }),
    ]);

    const sessionEndsByCategory: Record<string, number> = {};
    let totalSessionEnds = 0;
    for (const row of sessionEnds) {
      if (!row.categoryId) continue;
      sessionEndsByCategory[row.categoryId] = row._count._all;
      totalSessionEnds += row._count._all;
    }

    const itemDwellMs: Record<string, { totalMs: number; samples: number }> = {};
    let lastItem: { id: string; ts: number; session: string } | null = null;
    for (const ev of itemEvents) {
      if (lastItem && lastItem.session === ev.sessionId) {
        const delta = ev.timestamp.getTime() - lastItem.ts;
        if (delta > 0 && delta < 10 * 60 * 1000) {
          const bucket = (itemDwellMs[lastItem.id] ||= { totalMs: 0, samples: 0 });
          bucket.totalMs += delta;
          bucket.samples += 1;
        }
      }
      if (ev.type === AnalyticsEventType.ITEM_VIEW && ev.itemId) {
        lastItem = { id: ev.itemId, ts: ev.timestamp.getTime(), session: ev.sessionId };
      } else {
        lastItem = null;
      }
    }

    const itemDwell: EventAggregates['itemDwellMs'] = {};
    for (const [id, b] of Object.entries(itemDwellMs)) {
      itemDwell[id] = { avgMs: Math.round(b.totalMs / b.samples), samples: b.samples };
    }

    const weeklyItemViews: Record<string, number> = {};
    for (const row of weekItemViews) {
      if (row.itemId) weeklyItemViews[row.itemId] = row._count._all;
    }

    return {
      sessionEndsByCategory,
      totalSessionEnds,
      itemDwellMs: itemDwell,
      weeklyItemViews,
    };
  }

  private async persist(
    businessId: string,
    weekOf: Date,
    candidate: InsightCandidate,
  ): Promise<boolean> {
    const generated = await this.llm.generateOrPlaceholder(
      candidate.ruleId,
      candidate.rawData,
    );

    const data = {
      businessId,
      weekOf,
      ruleId: candidate.ruleId,
      severity: candidate.severity,
      title: generated.title,
      body: generated.body,
      rawData: candidate.rawData as unknown as Prisma.InputJsonValue,
      actionType: candidate.actionType ?? null,
      actionData: candidate.actionData
        ? (candidate.actionData as unknown as Prisma.InputJsonValue)
        : Prisma.JsonNull,
    };

    try {
      await this.prisma.insight.create({ data });
      return true;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        return false;
      }
      throw err;
    }
  }
}

function safeEvaluate(rule: InsightRule, ctx: RuleContext, logger: Logger): InsightCandidate | null {
  try {
    return rule.evaluate(ctx);
  } catch (err) {
    logger.error(`Rule ${rule.id} threw: ${(err as Error).message}`);
    return null;
  }
}
