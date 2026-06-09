import { DailySnapshot } from '@prisma/client';
import { WeeklySnapshot } from './types';
export declare function startOfIsoWeek(d: Date): Date;
export declare function buildWeeklySnapshots(daily: DailySnapshot[]): WeeklySnapshot[];
