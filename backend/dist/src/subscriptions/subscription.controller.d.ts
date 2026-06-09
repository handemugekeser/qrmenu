import { Response } from 'express';
import { SubscriptionService } from './subscription.service';
import { SubscriptionPlan } from '@prisma/client';
export declare class SubscriptionController {
    private subscriptionService;
    constructor(subscriptionService: SubscriptionService);
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
    getMyLimits(userId: string): Promise<{
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
    createCheckout(userId: string, email: string, plan: SubscriptionPlan): Promise<any>;
    paymentCallback(token: string, res: Response): Promise<void>;
    cancelSubscription(userId: string): Promise<{
        id: string;
        email: string;
        plan: import(".prisma/client").$Enums.SubscriptionPlan;
        planExpiresAt: Date;
    }>;
    upgrade(userId: string, plan: SubscriptionPlan): Promise<{
        id: string;
        email: string;
        plan: import(".prisma/client").$Enums.SubscriptionPlan;
        planExpiresAt: Date;
    }>;
}
