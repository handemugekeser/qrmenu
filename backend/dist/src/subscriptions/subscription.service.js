"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const plan_limits_constants_1 = require("../common/plan-limits.constants");
const Iyzipay = require('iyzipay');
const PLAN_PRICES = {
    PRO: '10.0',
    PREMIUM: '25.0',
};
let SubscriptionService = class SubscriptionService {
    constructor(prisma) {
        this.prisma = prisma;
        this.iyzipay = new Iyzipay({
            apiKey: process.env.IYZICO_API_KEY,
            secretKey: process.env.IYZICO_SECRET_KEY,
            uri: process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com',
        });
    }
    getPlanLimits(plan) {
        return plan_limits_constants_1.PLAN_LIMITS[plan];
    }
    async getUserLimits(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return {
            plan: user.plan,
            limits: plan_limits_constants_1.PLAN_LIMITS[user.plan],
            planExpiresAt: user.planExpiresAt,
        };
    }
    async createCheckout(userId, plan) {
        if (plan === client_1.SubscriptionPlan.FREE) {
            throw new common_1.BadRequestException('Cannot pay for FREE plan');
        }
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
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
        return new Promise((resolve, reject) => {
            this.iyzipay.checkoutFormInitialize.create(request, (err, result) => {
                if (err)
                    return reject(err);
                if (result.status !== 'success') {
                    return reject(new common_1.BadRequestException(result.errorMessage || 'Ödeme başlatılamadı'));
                }
                resolve({
                    checkoutFormContent: result.checkoutFormContent,
                    token: result.token,
                });
            });
        });
    }
    async handlePaymentCallback(token) {
        return new Promise((resolve) => {
            this.iyzipay.checkoutForm.retrieve({ locale: 'tr', token }, async (err, result) => {
                const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
                if (err || result.status !== 'success' || result.paymentStatus !== 'SUCCESS') {
                    return resolve({
                        success: false,
                        redirectUrl: `${frontendUrl}/subscription?payment=failed`,
                    });
                }
                try {
                    const [userId, plan] = result.conversationId.split(':');
                    await this.upgradePlan(userId, plan);
                    resolve({
                        success: true,
                        redirectUrl: `${frontendUrl}/subscription?payment=success`,
                    });
                }
                catch {
                    resolve({
                        success: false,
                        redirectUrl: `${frontendUrl}/subscription?payment=failed`,
                    });
                }
            });
        });
    }
    async upgradePlan(userId, plan) {
        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + 1);
        return this.prisma.user.update({
            where: { id: userId },
            data: { plan, planExpiresAt: expiresAt },
            select: { id: true, email: true, plan: true, planExpiresAt: true },
        });
    }
    async cancelSubscription(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (user.plan === client_1.SubscriptionPlan.FREE) {
            throw new common_1.BadRequestException('Zaten ücretsiz plandaysınız');
        }
        return this.prisma.user.update({
            where: { id: userId },
            data: { plan: client_1.SubscriptionPlan.FREE, planExpiresAt: null },
            select: { id: true, email: true, plan: true, planExpiresAt: true },
        });
    }
    getPlans() {
        return [
            {
                id: client_1.SubscriptionPlan.FREE,
                name: 'Free',
                price: 0,
                currency: 'USD',
                limits: plan_limits_constants_1.PLAN_LIMITS[client_1.SubscriptionPlan.FREE],
                features: ['1 İşletme', '1 Menü', '20 Ürün', 'QR Kod'],
            },
            {
                id: client_1.SubscriptionPlan.PRO,
                name: 'Pro',
                price: 10,
                currency: 'USD',
                limits: plan_limits_constants_1.PLAN_LIMITS[client_1.SubscriptionPlan.PRO],
                features: ['3 İşletme', '5 Menü', '100 Ürün', 'Analitik', 'Masa QR', 'Özel Tema'],
            },
            {
                id: client_1.SubscriptionPlan.PREMIUM,
                name: 'Premium',
                price: 25,
                currency: 'USD',
                limits: plan_limits_constants_1.PLAN_LIMITS[client_1.SubscriptionPlan.PREMIUM],
                features: ['Sınırsız İşletme', 'Sınırsız Menü', 'Sınırsız Ürün', 'Çoklu Dil', 'Öncelikli Destek'],
            },
        ];
    }
};
exports.SubscriptionService = SubscriptionService;
exports.SubscriptionService = SubscriptionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SubscriptionService);
//# sourceMappingURL=subscription.service.js.map