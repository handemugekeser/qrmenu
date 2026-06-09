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
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let AnalyticsService = class AnalyticsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async recordEvent(dto, userAgent) {
        return this.prisma.analyticsEvent.create({
            data: {
                businessId: dto.businessId,
                menuId: dto.menuId,
                type: dto.type,
                itemId: dto.itemId,
                categoryId: dto.categoryId,
                language: dto.language,
                sessionId: dto.sessionId,
                tableNumber: dto.tableNumber,
                userAgent,
                metadata: dto.metadata,
            },
        });
    }
    async track(menuId, req, tableNumber) {
        const userAgent = req.headers['user-agent'] || '';
        const deviceType = this.detectDevice(userAgent);
        const ipAddress = req.headers['x-forwarded-for']?.split(',')[0] || req.ip;
        return this.prisma.analytics.create({
            data: { menuId, deviceType, userAgent, ipAddress, tableNumber },
        });
    }
    async getSummary(menuId, userId) {
        const menu = await this.prisma.menu.findFirst({
            where: { id: menuId, business: { userId } },
        });
        if (!menu)
            return null;
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const [total, last30, last7, byDevice, dailyViews] = await Promise.all([
            this.prisma.analytics.count({ where: { menuId } }),
            this.prisma.analytics.count({ where: { menuId, createdAt: { gte: thirtyDaysAgo } } }),
            this.prisma.analytics.count({ where: { menuId, createdAt: { gte: sevenDaysAgo } } }),
            this.prisma.analytics.groupBy({
                by: ['deviceType'],
                where: { menuId },
                _count: { deviceType: true },
            }),
            this.prisma.$queryRaw `
        SELECT DATE(created_at)::text as date, COUNT(*)::int as count
        FROM analytics
        WHERE menu_id = ${menuId}
          AND created_at >= ${thirtyDaysAgo}
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `,
        ]);
        return {
            total,
            last30Days: last30,
            last7Days: last7,
            byDevice: byDevice.map((d) => ({
                device: d.deviceType,
                count: d._count.deviceType,
            })),
            dailyViews,
        };
    }
    async getBusinessAnalytics(businessId, userId) {
        const business = await this.prisma.business.findFirst({
            where: { id: businessId, userId },
            include: { menus: { select: { id: true, name: true } } },
        });
        if (!business)
            return null;
        const menuIds = business.menus.map((m) => m.id);
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const [total, last30, byMenu] = await Promise.all([
            this.prisma.analytics.count({ where: { menuId: { in: menuIds } } }),
            this.prisma.analytics.count({ where: { menuId: { in: menuIds }, createdAt: { gte: thirtyDaysAgo } } }),
            this.prisma.analytics.groupBy({
                by: ['menuId'],
                where: { menuId: { in: menuIds } },
                _count: { menuId: true },
            }),
        ]);
        const menuMap = Object.fromEntries(business.menus.map((m) => [m.id, m.name]));
        return {
            total,
            last30Days: last30,
            byMenu: byMenu.map((m) => ({
                menuId: m.menuId,
                menuName: menuMap[m.menuId],
                count: m._count.menuId,
            })),
        };
    }
    detectDevice(ua) {
        if (!ua)
            return client_1.DeviceType.UNKNOWN;
        if (/tablet|ipad|playbook|silk/i.test(ua))
            return client_1.DeviceType.TABLET;
        if (/mobile|iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(ua))
            return client_1.DeviceType.MOBILE;
        return client_1.DeviceType.DESKTOP;
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map