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
var AggregationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AggregationService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let AggregationService = AggregationService_1 = class AggregationService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(AggregationService_1.name);
    }
    async generateDailySnapshots(targetDate) {
        const day = targetDate ? new Date(targetDate) : new Date(Date.now() - 24 * 60 * 60 * 1000);
        const dayStart = new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate()));
        const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
        const businessGroups = await this.prisma.analyticsEvent.groupBy({
            by: ['businessId'],
            where: { timestamp: { gte: dayStart, lt: dayEnd } },
            _count: { _all: true },
        });
        this.logger.log(`Aggregating ${businessGroups.length} business(es) for ${dayStart.toISOString().slice(0, 10)}`);
        let written = 0;
        for (const grp of businessGroups) {
            try {
                await this.buildSnapshotFor(grp.businessId, dayStart, dayEnd);
                written++;
            }
            catch (err) {
                this.logger.error(`Snapshot failed for ${grp.businessId}: ${err.message}`);
            }
        }
        return { date: dayStart.toISOString().slice(0, 10), businesses: written };
    }
    async buildSnapshotFor(businessId, dayStart, dayEnd) {
        const where = { businessId, timestamp: { gte: dayStart, lt: dayEnd } };
        const [totalScans, uniqueSessionRows, itemAgg, categoryAgg, langAgg, sessions] = await Promise.all([
            this.prisma.analyticsEvent.count({ where: { ...where, type: client_1.AnalyticsEventType.SCAN_OPEN } }),
            this.prisma.analyticsEvent.findMany({
                where,
                distinct: ['sessionId'],
                select: { sessionId: true },
            }),
            this.prisma.analyticsEvent.groupBy({
                by: ['itemId'],
                where: { ...where, type: client_1.AnalyticsEventType.ITEM_VIEW, itemId: { not: null } },
                _count: { _all: true },
                orderBy: { _count: { itemId: 'desc' } },
                take: 10,
            }),
            this.prisma.analyticsEvent.groupBy({
                by: ['categoryId'],
                where: { ...where, type: client_1.AnalyticsEventType.CATEGORY_VIEW, categoryId: { not: null } },
                _count: { _all: true },
                orderBy: { _count: { categoryId: 'desc' } },
                take: 10,
            }),
            this.prisma.analyticsEvent.groupBy({
                by: ['language'],
                where: {
                    ...where,
                    type: { in: [client_1.AnalyticsEventType.SCAN_OPEN, client_1.AnalyticsEventType.LANGUAGE_CHANGE] },
                    language: { not: null },
                },
                _count: { _all: true },
            }),
            this.prisma.analyticsEvent.findMany({
                where,
                select: { sessionId: true, timestamp: true },
                orderBy: { timestamp: 'asc' },
            }),
        ]);
        const itemIds = itemAgg.map((r) => r.itemId).filter(Boolean);
        const categoryIds = categoryAgg.map((r) => r.categoryId).filter(Boolean);
        const [products, categories] = await Promise.all([
            itemIds.length
                ? this.prisma.product.findMany({ where: { id: { in: itemIds } }, select: { id: true, name: true } })
                : Promise.resolve([]),
            categoryIds.length
                ? this.prisma.category.findMany({ where: { id: { in: categoryIds } }, select: { id: true, name: true } })
                : Promise.resolve([]),
        ]);
        const productName = new Map(products.map((p) => [p.id, p.name]));
        const categoryName = new Map(categories.map((c) => [c.id, c.name]));
        const topItems = itemAgg.map((r) => ({
            itemId: r.itemId,
            name: productName.get(r.itemId) || '',
            views: r._count._all,
        }));
        const topCategories = categoryAgg.map((r) => ({
            categoryId: r.categoryId,
            name: categoryName.get(r.categoryId) || '',
            views: r._count._all,
        }));
        const languageDist = {};
        for (const row of langAgg) {
            if (row.language)
                languageDist[row.language] = (languageDist[row.language] || 0) + row._count._all;
        }
        const hourlyDist = new Array(24).fill(0);
        for (const row of sessions) {
            hourlyDist[row.timestamp.getUTCHours()]++;
        }
        const sessionSpans = new Map();
        for (const row of sessions) {
            const ts = row.timestamp.getTime();
            const cur = sessionSpans.get(row.sessionId);
            if (!cur)
                sessionSpans.set(row.sessionId, { first: ts, last: ts });
            else
                cur.last = ts;
        }
        let avgSessionMs = 0;
        if (sessionSpans.size > 0) {
            let totalMs = 0;
            for (const span of sessionSpans.values())
                totalMs += span.last - span.first;
            avgSessionMs = Math.round(totalMs / sessionSpans.size);
        }
        const data = {
            totalScans,
            uniqueSessions: uniqueSessionRows.length,
            topItems: topItems,
            topCategories: topCategories,
            languageDist: languageDist,
            hourlyDist: hourlyDist,
            avgSessionMs,
        };
        return this.prisma.dailySnapshot.upsert({
            where: { businessId_date: { businessId, date: dayStart } },
            create: { businessId, date: dayStart, ...data },
            update: data,
        });
    }
};
exports.AggregationService = AggregationService;
__decorate([
    (0, schedule_1.Cron)('0 1 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date]),
    __metadata("design:returntype", Promise)
], AggregationService.prototype, "generateDailySnapshots", null);
exports.AggregationService = AggregationService = AggregationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AggregationService);
//# sourceMappingURL=aggregation.service.js.map