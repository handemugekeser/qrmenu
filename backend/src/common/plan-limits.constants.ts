import { SubscriptionPlan } from '@prisma/client';

export const PLAN_LIMITS = {
  [SubscriptionPlan.FREE]: {
    maxBusinesses: 1,
    maxMenus: 1,
    maxCategories: 5,
    maxProducts: 20,
    analytics: false,
    customTheme: false,
    multiLanguage: false,
    tableQr: false,
  },
  [SubscriptionPlan.PRO]: {
    maxBusinesses: 3,
    maxMenus: 5,
    maxCategories: 20,
    maxProducts: 100,
    analytics: true,
    customTheme: true,
    multiLanguage: false,
    tableQr: true,
  },
  [SubscriptionPlan.PREMIUM]: {
    maxBusinesses: -1,
    maxMenus: -1,
    maxCategories: -1,
    maxProducts: -1,
    analytics: true,
    customTheme: true,
    multiLanguage: true,
    tableQr: true,
  },
};
