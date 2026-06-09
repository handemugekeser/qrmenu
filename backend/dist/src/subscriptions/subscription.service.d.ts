import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionPlan } from '@prisma/client';
export declare class SubscriptionService {
    private prisma;
    private iyzipay;
    constructor(prisma: PrismaService);
    getPlanLimits(plan: SubscriptionPlan): {
        maxBusinesses: number;
        maxMenus: number;
        maxCategories: number;
        maxProducts: number;
        analytics: boolean;
        customTheme: boolean;
        multiLanguage: boolean;
        tableQr: boolean;
    } | {
        maxBusinesses: number;
        maxMenus: number;
        maxCategories: number;
        maxProducts: number;
        analytics: boolean;
        customTheme: boolean;
        multiLanguage: boolean;
        tableQr: boolean;
    } | {
        maxBusinesses: number;
        maxMenus: number;
        maxCategories: number;
        maxProducts: number;
        analytics: boolean;
        customTheme: boolean;
        multiLanguage: boolean;
        tableQr: boolean;
    };
    getUserLimits(userId: string): Promise<{
        plan: import(".prisma/client").$Enums.SubscriptionPlan;
        limits: {
            maxBusinesses: number;
            maxMenus: number;
            maxCategories: number;
            maxProducts: number;
            analytics: boolean;
            customTheme: boolean;
            multiLanguage: boolean;
            tableQr: boolean;
        } | {
            maxBusinesses: number;
            maxMenus: number;
            maxCategories: number;
            maxProducts: number;
            analytics: boolean;
            customTheme: boolean;
            multiLanguage: boolean;
            tableQr: boolean;
        } | {
            maxBusinesses: number;
            maxMenus: number;
            maxCategories: number;
            maxProducts: number;
            analytics: boolean;
            customTheme: boolean;
            multiLanguage: boolean;
            tableQr: boolean;
        };
        planExpiresAt: Date;
    }>;
    createCheckout(userId: string, plan: SubscriptionPlan): Promise<any>;
    handlePaymentCallback(token: string): Promise<{
        success: boolean;
        redirectUrl: string;
    }>;
    upgradePlan(userId: string, plan: SubscriptionPlan): Promise<{
        id: string;
        email: string;
        plan: import(".prisma/client").$Enums.SubscriptionPlan;
        planExpiresAt: Date;
    }>;
    cancelSubscription(userId: string): Promise<{
        id: string;
        email: string;
        plan: import(".prisma/client").$Enums.SubscriptionPlan;
        planExpiresAt: Date;
    }>;
    getPlans(): ({
        id: "FREE";
        name: string;
        price: number;
        currency: string;
        limits: {
            maxBusinesses: number;
            maxMenus: number;
            maxCategories: number;
            maxProducts: number;
            analytics: boolean;
            customTheme: boolean;
            multiLanguage: boolean;
            tableQr: boolean;
        };
        features: string[];
    } | {
        id: "PRO";
        name: string;
        price: number;
        currency: string;
        limits: {
            maxBusinesses: number;
            maxMenus: number;
            maxCategories: number;
            maxProducts: number;
            analytics: boolean;
            customTheme: boolean;
            multiLanguage: boolean;
            tableQr: boolean;
        };
        features: string[];
    } | {
        id: "PREMIUM";
        name: string;
        price: number;
        currency: string;
        limits: {
            maxBusinesses: number;
            maxMenus: number;
            maxCategories: number;
            maxProducts: number;
            analytics: boolean;
            customTheme: boolean;
            multiLanguage: boolean;
            tableQr: boolean;
        };
        features: string[];
    })[];
}
