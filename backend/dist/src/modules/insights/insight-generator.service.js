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
var InsightGeneratorService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsightGeneratorService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const llm_1 = require("./llm");
const rules_1 = require("./rules");
const weekly_aggregator_1 = require("./weekly-aggregator");
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const DAILY_LOOKBACK_DAYS = 7;
const WEEKLY_LOOKBACK_DAYS = 28;
let InsightGeneratorService = InsightGeneratorService_1 = class InsightGeneratorService {
    constructor(prisma, llm, rules = rules_1.ALL_RULES) {
        this.prisma = prisma;
        this.llm = llm;
        this.rules = rules;
        this.logger = new common_1.Logger(InsightGeneratorService_1.name);
    }
    async generateWeeklyInsights(now = new Date()) {
        const weekOf = (0, weekly_aggregator_1.startOfIsoWeek)(now);
        const businesses = await this.prisma.business.findMany({
            where: { isActive: true },
            select: { id: true },
        });
        this.logger.log(`Generating insights for ${businesses.length} business(es), week=${weekOf.toISOString().slice(0, 10)}`);
        let total = 0;
        for (const { id } of businesses) {
            try {
                total += await this.generateForBusiness(id, weekOf, now);
            }
            catch (err) {
                this.logger.error(`Insight generation failed for ${id}: ${err.message}`);
            }
        }
        return { weekOf, businesses: businesses.length, insights: total };
    }
    async generateForBusiness(businessId, weekOf, now = new Date()) {
        const ctx = await this.buildContext(businessId, now);
        if (!ctx)
            return 0;
        let written = 0;
        for (const rule of this.rules) {
            const candidate = safeEvaluate(rule, ctx, this.logger);
            if (!candidate)
                continue;
            const saved = await this.persist(businessId, weekOf, candidate);
            if (saved)
                written++;
        }
        return written;
    }
    async buildContext(businessId, now) {
        const business = await this.prisma.business.findUnique({ where: { id: businessId } });
        if (!business)
            return null;
        const menu = await this.prisma.menu.findFirst({
            where: { businessId, isDefault: true },
            include: {
                categories: {
                    include: {
                        translations: true,
                        products: { include: { translations: true } },
                    },
                },
            },
        });
        if (!menu)
            return null;
        const dailyStart = new Date(now.getTime() - DAILY_LOOKBACK_DAYS * MS_PER_DAY);
        const weeklyStart = new Date(now.getTime() - WEEKLY_LOOKBACK_DAYS * MS_PER_DAY);
        const [daily, weeklySource] = await Promise.all([
            this.prisma.dailySnapshot.findMany({
                where: { businessId, date: { gte: dailyStart } },
                orderBy: { date: 'asc' },
            }),
            this.prisma.dailySnapshot.findMany({
                where: { businessId, date: { gte: weeklyStart } },
                orderBy: { date: 'asc' },
            }),
        ]);
        const aggregates = await this.buildAggregates(businessId, weeklyStart, now);
        const weekly = (0, weekly_aggregator_1.buildWeeklySnapshots)(weeklySource);
        return {
            business,
            menu: menu,
            daily,
            weekly,
            aggregates,
            now,
        };
    }
    async buildAggregates(businessId, since, until) {
        const weekStart = new Date(until.getTime() - 7 * MS_PER_DAY);
        const [sessionEnds, itemEvents, weekItemViews] = await Promise.all([
            this.prisma.analyticsEvent.groupBy({
                by: ['categoryId'],
                where: {
                    businessId,
                    type: client_1.AnalyticsEventType.SESSION_END,
                    timestamp: { gte: weekStart, lte: until },
                    categoryId: { not: null },
                },
                _count: { _all: true },
            }),
            this.prisma.analyticsEvent.findMany({
                where: {
                    businessId,
                    timestamp: { gte: weekStart, lte: until },
                    sessionId: { not: undefined },
                },
                select: { sessionId: true, type: true, itemId: true, timestamp: true },
                orderBy: [{ sessionId: 'asc' }, { timestamp: 'asc' }],
            }),
            this.prisma.analyticsEvent.groupBy({
                by: ['itemId'],
                where: {
                    businessId,
                    type: client_1.AnalyticsEventType.ITEM_VIEW,
                    timestamp: { gte: weekStart, lte: until },
                    itemId: { not: null },
                },
                _count: { _all: true },
            }),
        ]);
        const sessionEndsByCategory = {};
        let totalSessionEnds = 0;
        for (const row of sessionEnds) {
            if (!row.categoryId)
                continue;
            sessionEndsByCategory[row.categoryId] = row._count._all;
            totalSessionEnds += row._count._all;
        }
        const itemDwellMs = {};
        let lastItem = null;
        for (const ev of itemEvents) {
            if (lastItem && lastItem.session === ev.sessionId) {
                const delta = ev.timestamp.getTime() - lastItem.ts;
                if (delta > 0 && delta < 10 * 60 * 1000) {
                    const bucket = (itemDwellMs[lastItem.id] ||= { totalMs: 0, samples: 0 });
                    bucket.totalMs += delta;
                    bucket.samples += 1;
                }
            }
            if (ev.type === client_1.AnalyticsEventType.ITEM_VIEW && ev.itemId) {
                lastItem = { id: ev.itemId, ts: ev.timestamp.getTime(), session: ev.sessionId };
            }
            else {
                lastItem = null;
            }
        }
        const itemDwell = {};
        for (const [id, b] of Object.entries(itemDwellMs)) {
            itemDwell[id] = { avgMs: Math.round(b.totalMs / b.samples), samples: b.samples };
        }
        const weeklyItemViews = {};
        for (const row of weekItemViews) {
            if (row.itemId)
                weeklyItemViews[row.itemId] = row._count._all;
        }
        return {
            sessionEndsByCategory,
            totalSessionEnds,
            itemDwellMs: itemDwell,
            weeklyItemViews,
        };
    }
    async persist(businessId, weekOf, candidate) {
        const generated = await this.llm.generateOrPlaceholder(candidate.ruleId, candidate.rawData);
        const data = {
            businessId,
            weekOf,
            ruleId: candidate.ruleId,
            severity: candidate.severity,
            title: generated.title,
            body: generated.body,
            rawData: candidate.rawData,
            actionType: candidate.actionType ?? null,
            actionData: candidate.actionData
                ? candidate.actionData
                : client_1.Prisma.JsonNull,
        };
        try {
            await this.prisma.insight.create({ data });
            return true;
        }
        catch (err) {
            if (err instanceof client_1.Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
                return false;
            }
            throw err;
        }
    }
};
exports.InsightGeneratorService = InsightGeneratorService;
__decorate([
    (0, schedule_1.Cron)('0 2 * * 1'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date]),
    __metadata("design:returntype", Promise)
], InsightGeneratorService.prototype, "generateWeeklyInsights", null);
exports.InsightGeneratorService = InsightGeneratorService = InsightGeneratorService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        llm_1.LlmInsightService, Array])
], InsightGeneratorService);
function safeEvaluate(rule, ctx, logger) {
    try {
        return rule.evaluate(ctx);
    }
    catch (err) {
        logger.error(`Rule ${rule.id} threw: ${err.message}`);
        return null;
    }
}
//# sourceMappingURL=insight-generator.service.js.map