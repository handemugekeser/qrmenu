import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionPlan } from '@prisma/client';
import { PLAN_LIMITS } from '../common/plan-limits.constants';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const Iyzipay = require('iyzipay');

const PLAN_PRICES: Record<string, string> = {
  PRO: '10.0',
  PREMIUM: '25.0',
};

@Injectable()
export class SubscriptionService {
  private iyzipay: any;

  constructor(private prisma: PrismaService) {
    this.iyzipay = new Iyzipay({
      apiKey: process.env.IYZICO_API_KEY,
      secretKey: process.env.IYZICO_SECRET_KEY,
      uri: process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com',
    });
  }

  getPlanLimits(plan: SubscriptionPlan) {
    return PLAN_LIMITS[plan];
  }

  async getUserLimits(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    return {
      plan: user.plan,
      limits: PLAN_LIMITS[user.plan],
      planExpiresAt: user.planExpiresAt,
    };
  }

  async createCheckout(userId: string, plan: SubscriptionPlan) {
    if (plan === SubscriptionPlan.FREE) {
      throw new BadRequestException('Cannot pay for FREE plan');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const price = PLAN_PRICES[plan];
    const conversationId = `${userId}:${plan}:${Date.now()}`;
    const nameParts = user.name.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || nameParts[0];
    const callbackUrl = `${process.env.BACKEND_URL}/api/subscriptions/payment-callback`;

    const request = {
      locale: 'tr',
      conversationId,
      price,
      paidPrice: price,
      currency: 'USD',
      basketId: `basket_${Date.now()}`,
      paymentGroup: 'PRODUCT',
      callbackUrl,
      enabledInstallments: [1, 2, 3, 6, 9],
      buyer: {
        id: userId,
        name: firstName,
        surname: lastName,
        email: user.email,
        identityNumber: '74300864791',
        registrationAddress: 'Türkiye',
        ip: '85.34.78.112',
        city: 'Istanbul',
        country: 'Turkey',
      },
      shippingAddress: {
        contactName: user.name,
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Türkiye',
      },
      billingAddress: {
        contactName: user.name,
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Türkiye',
      },
      basketItems: [
        {
          id: plan,
          name: `QRmenu ${plan} Plan`,
          category1: 'Abonelik',
          itemType: 'VIRTUAL',
          price,
        },
      ],
    };

    return new Promise<any>((resolve, reject) => {
      this.iyzipay.checkoutFormInitialize.create(request, (err: any, result: any) => {
        if (err) return reject(err);
        if (result.status !== 'success') {
          return reject(new BadRequestException(result.errorMessage || 'Ödeme başlatılamadı'));
        }
        resolve({
          checkoutFormContent: result.checkoutFormContent,
          token: result.token,
        });
      });
    });
  }

  async handlePaymentCallback(token: string) {
    return new Promise<{ success: boolean; redirectUrl: string }>((resolve) => {
      this.iyzipay.checkoutForm.retrieve(
        { locale: 'tr', token },
        async (err: any, result: any) => {
          const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

          if (err || result.status !== 'success' || result.paymentStatus !== 'SUCCESS') {
            return resolve({
              success: false,
              redirectUrl: `${frontendUrl}/subscription?payment=failed`,
            });
          }

          try {
            const [userId, plan] = result.conversationId.split(':');
            await this.upgradePlan(userId, plan as SubscriptionPlan);
            resolve({
              success: true,
              redirectUrl: `${frontendUrl}/subscription?payment=success`,
            });
          } catch {
            resolve({
              success: false,
              redirectUrl: `${frontendUrl}/subscription?payment=failed`,
            });
          }
        },
      );
    });
  }

  async upgradePlan(userId: string, plan: SubscriptionPlan) {
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);
    return this.prisma.user.update({
      where: { id: userId },
      data: { plan, planExpiresAt: expiresAt },
      select: { id: true, email: true, plan: true, planExpiresAt: true },
    });
  }

  async cancelSubscription(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    if (user.plan === SubscriptionPlan.FREE) {
      throw new BadRequestException('Zaten ücretsiz plandaysınız');
    }
    return this.prisma.user.update({
      where: { id: userId },
      data: { plan: SubscriptionPlan.FREE, planExpiresAt: null },
      select: { id: true, email: true, plan: true, planExpiresAt: true },
    });
  }

  getPlans() {
    return [
      {
        id: SubscriptionPlan.FREE,
        name: 'Free',
        price: 0,
        currency: 'USD',
        limits: PLAN_LIMITS[SubscriptionPlan.FREE],
        features: ['1 İşletme', '1 Menü', '20 Ürün', 'QR Kod'],
      },
      {
        id: SubscriptionPlan.PRO,
        name: 'Pro',
        price: 10,
        currency: 'USD',
        limits: PLAN_LIMITS[SubscriptionPlan.PRO],
        features: ['3 İşletme', '5 Menü', '100 Ürün', 'Analitik', 'Masa QR', 'Özel Tema'],
      },
      {
        id: SubscriptionPlan.PREMIUM,
        name: 'Premium',
        price: 25,
        currency: 'USD',
        limits: PLAN_LIMITS[SubscriptionPlan.PREMIUM],
        features: ['Sınırsız İşletme', 'Sınırsız Menü', 'Sınırsız Ürün', 'Çoklu Dil', 'Öncelikli Destek'],
      },
    ];
  }
}
