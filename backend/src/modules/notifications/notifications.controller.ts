import { Body, Controller, Get, Param, Patch, Post, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { NotificationsService } from './notifications.service';

interface PreferencesPatch {
  weeklyInsightsEmail?: boolean;
  weeklyInsightsInApp?: boolean;
}

@Controller('notifications')
export class NotificationsController {
  constructor(private notifications: NotificationsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  list(@CurrentUser('id') userId: string) {
    return this.notifications.listForUser(userId);
  }

  @Get('unread-count')
  @UseGuards(JwtAuthGuard)
  async unreadCount(@CurrentUser('id') userId: string) {
    const count = await this.notifications.unreadCount(userId);
    return { count };
  }

  @Post('mark-read')
  @UseGuards(JwtAuthGuard)
  markAll(@CurrentUser('id') userId: string) {
    return this.notifications.markAllRead(userId);
  }

  @Post(':id/read')
  @UseGuards(JwtAuthGuard)
  markOne(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.notifications.markRead(userId, id);
  }

  @Get('preferences')
  @UseGuards(JwtAuthGuard)
  getPrefs(@CurrentUser('id') userId: string) {
    return this.notifications.getPreferences(userId);
  }

  @Patch('preferences')
  @UseGuards(JwtAuthGuard)
  updatePrefs(
    @CurrentUser('id') userId: string,
    @Body() patch: PreferencesPatch,
  ) {
    const clean: PreferencesPatch = {};
    if (typeof patch.weeklyInsightsEmail === 'boolean') clean.weeklyInsightsEmail = patch.weeklyInsightsEmail;
    if (typeof patch.weeklyInsightsInApp === 'boolean') clean.weeklyInsightsInApp = patch.weeklyInsightsInApp;
    return this.notifications.updatePreferences(userId, clean);
  }

  @Public()
  @Get('unsubscribe')
  async unsubscribeGet(
    @Query('token') token: string,
    @Query('topic') topic = 'weekly_insights',
    @Res() res: Response,
  ) {
    const ok = await this.notifications.unsubscribeByToken(token, topic);
    return res.status(ok ? 200 : 400).type('text/html').send(unsubscribeHtml(ok));
  }

  @Public()
  @Post('unsubscribe')
  async unsubscribePost(
    @Query('token') token: string,
    @Query('topic') topic = 'weekly_insights',
  ) {
    const ok = await this.notifications.unsubscribeByToken(token, topic);
    return { ok };
  }
}

function unsubscribeHtml(ok: boolean): string {
  const title = ok ? 'Aboneliğiniz iptal edildi' : 'Geçersiz bağlantı';
  const body = ok
    ? 'Haftalık AI öneri e-postalarını artık almayacaksınız. İsterseniz panelinizden tekrar açabilirsiniz.'
    : 'Bu bağlantı geçersiz veya süresi dolmuş.';
  return `<!doctype html><html lang="tr"><head><meta charset="utf-8"/><title>${title}</title>
<style>body{font-family:-apple-system,Inter,sans-serif;background:#f8f9ff;margin:0;padding:48px 16px;color:#0d1b3e}
.box{max-width:480px;margin:0 auto;background:#fff;border:1px solid rgba(59,91,219,.1);border-radius:16px;padding:32px;text-align:center}
h1{font-size:20px;margin:0 0 12px}p{color:rgba(13,27,62,.6);line-height:1.5;margin:0}</style></head>
<body><div class="box"><h1>${title}</h1><p>${body}</p></div></body></html>`;
}
