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
exports.InsightsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
let InsightsService = class InsightsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(userId, filter = 'new') {
        const businessIds = await this.userBusinessIds(userId);
        if (businessIds.length === 0)
            return { items: [], counts: this.emptyCounts() };
        const where = { businessId: { in: businessIds } };
        if (filter !== 'all') {
            where.status = filter.toUpperCase();
        }
        const [items, counts] = await Promise.all([
            this.prisma.insight.findMany({
                where,
                orderBy: [{ weekOf: 'desc' }, { severity: 'desc' }, { createdAt: 'desc' }],
                take: 50,
            }),
            this.statusCounts(businessIds),
        ]);
        return { items, counts };
    }
    async apply(userId, id) {
        await this.assertOwnership(userId, id);
        return this.prisma.insight.update({
            where: { id },
            data: { status: client_1.InsightStatus.APPLIED },
        });
    }
    async dismiss(userId, id) {
        await this.assertOwnership(userId, id);
        return this.prisma.insight.update({
            where: { id },
            data: { status: client_1.InsightStatus.DISMISSED },
        });
    }
    async markViewed(userId, id) {
        const insight = await this.assertOwnership(userId, id);
        if (insight.status !== client_1.InsightStatus.NEW)
            return insight;
        return this.prisma.insight.update({
            where: { id },
            data: { status: client_1.InsightStatus.VIEWED },
        });
    }
    async assertOwnership(userId, id) {
        const insight = await this.prisma.insight.findUnique({ where: { id } });
        if (!insight)
            throw new common_1.NotFoundException('Insight not found');
        const owned = await this.prisma.business.findFirst({
            where: { id: insight.businessId, userId },
            select: { id: true },
        });
        if (!owned)
            throw new common_1.ForbiddenException();
        return insight;
    }
    async userBusinessIds(userId) {
        const rows = await this.prisma.business.findMany({
            where: { userId },
            select: { id: true },
        });
        return rows.map((r) => r.id);
    }
    async statusCounts(businessIds) {
        const grouped = await this.prisma.insight.groupBy({
            by: ['status'],
            where: { businessId: { in: businessIds } },
            _count: { _all: true },
        });
        const counts = this.emptyCounts();
        for (const row of grouped) {
            counts[row.status.toLowerCase()] = row._count._all;
        }
        return counts;
    }
    emptyCounts() {
        return { new: 0, viewed: 0, applied: 0, dismissed: 0 };
    }
};
exports.InsightsService = InsightsService;
exports.InsightsService = InsightsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InsightsService);
//# sourceMappingURL=insights.service.js.map