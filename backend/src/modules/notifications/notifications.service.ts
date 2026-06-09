import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Language,
  NotificationChannelStatus,
  NotificationType,
  Prisma,
} from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';
import { EmailService } from './email/email.service';
import { renderWeeklyInsightsEmail } from './email/templates';

export interface WeeklyInsightsPayload {
  businessId: string;
  count: number;
  topInsight: { title: string; body: string };
}

interface UserPref {
  weeklyInsightsEmail: boolean;
  weeklyInsightsInApp: boolean;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private prisma: PrismaService,
    private email: EmailService,
    private config: ConfigService,
  ) {}

  async listForUser(userId: string, limit = 30) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async unreadCount(userId: string): Promise<number> {
    return this.prisma.notification.count({
      where: { userId, readAt: null },
    });
  }

  async markAllRead(userId: string): Promise<{ updated: number }> {
    const res = await this.prisma.notification.updateMany({
      where: { userId, readAt: null },
      data: { readAt: new Date() },
    });
    return { updated: res.count };
  }

  async markRead(userId: string, id: string) {
    await this.prisma.notification.updateMany({
      where: { id, userId, readAt: null },
      data: { readAt: new Date() },
    });
    return { ok: true };
  }

  async getPreferences(userId: string) {
    const pref = await this.prisma.notificationPreference.findUnique({
      where: { userId },
    });
    if (pref) return pref;
    return this.prisma.notificationPreference.create({
      data: { userId },
    });
  }

  async updatePreferences(
    userId: string,
    patch: Partial<UserPref>,
  ) {
    return this.prisma.notificationPreference.upsert({
      where: { userId },
      create: { userId, ...patch },
      update: patch,
    });
  }

  async sendWeeklyInsightsReady(payload: WeeklyInsightsPayload) {
    const business = await this.prisma.business.findUnique({
      where: { id: payload.businessId },
      include: { user: true },
    });
    if (!business || !business.user) {
      this.logger.warn(`weekly-insights: business=${payload.businessId} not found`);
      return;
    }

    const user = business.user;
    const pref = await this.getPreferences(user.id);

    const notification = await this.prisma.notification.create({
      data: {
        userId: user.id,
        businessId: business.id,
        type: NotificationType.WEEKLY_INSIGHTS_READY,
        title: this.localizedTitle(user.locale, payload.count),
        body: payload.topInsight.title,
        data: {
          count: payload.count,
          topInsight: payload.topInsight,
          businessId: business.id,
        } as Prisma.InputJsonValue,
        emailStatus: pref.weeklyInsightsEmail
          ? NotificationChannelStatus.PENDING
          : NotificationChannelStatus.SKIPPED,
      },
    });

    if (!pref.weeklyInsightsInApp) {
      await this.prisma.notification.update({
        where: { id: notification.id },
        data: { readAt: new Date() },
      });
    }

    if (!pref.weeklyInsightsEmail) {
      return notification;
    }

    const appUrl = this.config.get<string>('FRONTEND_URL') || 'http://localhost:5173';
    const unsubscribeUrl = `${appUrl}/unsubscribe?token=${user.unsubscribeToken}&topic=weekly_insights`;
    const preferencesUrl = `${appUrl}/app/settings#notifications`;

    const rendered = renderWeeklyInsightsEmail(user.locale, {
      ownerName: user.name,
      count: payload.count,
      topInsightTitle: payload.topInsight.title,
      topInsightBody: payload.topInsight.body,
      appUrl,
      unsubscribeUrl,
      preferencesUrl,
    });

    const result = await this.email.sendRendered(user.email, rendered, {
      'List-Unsubscribe': `<${unsubscribeUrl}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    });

    await this.prisma.notification.update({
      where: { id: notification.id },
      data: {
        emailStatus: result.ok
          ? NotificationChannelStatus.SENT
          : NotificationChannelStatus.FAILED,
        emailError: result.error ?? null,
      },
    });

    return notification;
  }

  async unsubscribeByToken(token: string, topic: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { unsubscribeToken: token } });
    if (!user) return false;

    if (topic === 'weekly_insights') {
      await this.prisma.notificationPreference.upsert({
        where: { userId: user.id },
        create: { userId: user.id, weeklyInsightsEmail: false },
        update: { weeklyInsightsEmail: false },
      });
      return true;
    }
    return false;
  }

  private localizedTitle(locale: Language, count: number): string {
    switch (locale) {
      case 'EN':
        return `${count} new AI suggestion${count === 1 ? '' : 's'} for your menu`;
      case 'AR':
        return `${count} توصية جديدة من الذكاء الاصطناعي لقائمتك`;
      case 'TR':
      default:
        return `Menünüz için ${count} yeni AI önerisi`;
    }
  }
}
