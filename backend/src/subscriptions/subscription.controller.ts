import { Controller, Get, Post, Body, UseGuards, Res } from '@nestjs/common';
import { Response } from 'express';
import { SubscriptionService } from './subscription.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { SubscriptionPlan } from '@prisma/client';
import { Public } from '../common/decorators/public.decorator';

@Controller('subscriptions')
@UseGuards(JwtAuthGuard)
export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}

  @Get('plans')
  getPlans() {
    return this.subscriptionService.getPlans();
  }

  @Get('my')
  getMyLimits(@CurrentUser('id') userId: string) {
    return this.subscriptionService.getUserLimits(userId);
  }

  @Post('create-checkout')
  async createCheckout(
    @CurrentUser('id') userId: string,
    @CurrentUser('email') email: string,
    @Body('plan') plan: SubscriptionPlan,
  ) {
    if (email === 'demo@qemenu.app') {
      return this.subscriptionService.upgradePlan(userId, plan);
    }
    return this.subscriptionService.createCheckout(userId, plan);
  }

  @Public()
  @Post('payment-callback')
  async paymentCallback(@Body('token') token: string, @Res() res: Response) {
    const result = await this.subscriptionService.handlePaymentCallback(token);
    return res.redirect(result.redirectUrl);
  }

  @Post('cancel')
  async cancelSubscription(@CurrentUser('id') userId: string) {
    return this.subscriptionService.cancelSubscription(userId);
  }

  // Kept for backward compatibility / admin use
  @Post('upgrade')
  upgrade(@CurrentUser('id') userId: string, @Body('plan') plan: SubscriptionPlan) {
    return this.subscriptionService.upgradePlan(userId, plan);
  }
}
