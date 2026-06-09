import { createHash } from 'crypto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

const TTL_DAYS = 7;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export interface CachedInsight {
  title: string;
  body: string;
}

@Injectable()
export class InsightCacheStore {
  constructor(private readonly prisma: PrismaService) {}

  static keyOf(ruleId: string, rawData: Record<string, unknown>): string {
    const canonical = canonicalize(rawData);
    return createHash('sha256').update(`${ruleId}:${canonical}`).digest('hex');
  }

  async get(key: string): Promise<CachedInsight | null> {
    const row = await this.prisma.insightCache.findUnique({ where: { key } });
    if (!row) return null;
    if (row.expiresAt.getTime() <= Date.now()) {
      await this.prisma.insightCache.delete({ where: { key } }).catch(() => undefined);
      return null;
    }
    return { title: row.title, body: row.body };
  }

  async set(key: string, ruleId: string, value: CachedInsight): Promise<void> {
    const expiresAt = new Date(Date.now() + TTL_DAYS * MS_PER_DAY);
    await this.prisma.insightCache.upsert({
      where: { key },
      create: { key, ruleId, title: value.title, body: value.body, expiresAt },
      update: { title: value.title, body: value.body, expiresAt },
    });
  }
}

function canonicalize(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(',')}]`;
  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${canonicalize(obj[k])}`).join(',')}}`;
}
