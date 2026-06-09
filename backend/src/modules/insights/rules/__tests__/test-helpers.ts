import {
  Business,
  DailySnapshot,
  Language,
  SubscriptionPlan,
} from '@prisma/client';
import { EventAggregates, MenuWithContent, RuleContext, WeeklySnapshot } from '../../types';

export function fakeBusiness(overrides: Partial<Business> = {}): Business {
  return {
    id: 'biz-1',
    userId: 'user-1',
    name: 'Test Cafe',
    slug: 'test-cafe',
    description: null,
    phone: null,
    address: null,
    logoUrl: null,
    coverUrl: null,
    currency: 'TRY',
    defaultLang: Language.TR,
    socialLinks: null,
    isActive: true,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    ...overrides,
  };
}

export function fakeMenu(overrides: Partial<MenuWithContent> = {}): MenuWithContent {
  return {
    id: 'menu-1',
    businessId: 'biz-1',
    name: 'Main',
    description: null,
    isActive: true,
    isDefault: true,
    themeColor: '#FF6B35',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    categories: [],
    ...overrides,
  };
}

export function fakeDaily(overrides: Partial<DailySnapshot> = {}): DailySnapshot {
  return {
    id: 'snap-1',
    businessId: 'biz-1',
    date: new Date('2026-06-01'),
    totalScans: 100,
    uniqueSessions: 80,
    topItems: [],
    topCategories: [],
    languageDist: {},
    hourlyDist: new Array(24).fill(0),
    avgSessionMs: 30_000,
    ...overrides,
  } as DailySnapshot;
}

export function fakeWeekly(overrides: Partial<WeeklySnapshot> = {}): WeeklySnapshot {
  return {
    businessId: 'biz-1',
    weekStart: new Date('2026-06-01'),
    totalScans: 700,
    uniqueSessions: 500,
    topItems: [],
    topCategories: [],
    languageDist: {},
    hourlyDist: new Array(24).fill(0),
    avgSessionMs: 30_000,
    ...overrides,
  };
}

export function emptyAggregates(): EventAggregates {
  return {
    sessionEndsByCategory: {},
    totalSessionEnds: 0,
    itemDwellMs: {},
    weeklyItemViews: {},
  };
}

export function makeContext(overrides: Partial<RuleContext> = {}): RuleContext {
  return {
    business: fakeBusiness(),
    menu: fakeMenu(),
    daily: [],
    weekly: [],
    aggregates: emptyAggregates(),
    now: new Date('2026-06-09'),
    ...overrides,
  };
}

export const SubscriptionPlanRef = SubscriptionPlan;
