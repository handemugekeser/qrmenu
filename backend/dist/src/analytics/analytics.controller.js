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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const analytics_service_1 = require("./analytics.service");
const aggregation_service_1 = require("./aggregation.service");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const public_decorator_1 = require("../common/decorators/public.decorator");
const track_event_dto_1 = require("./dto/track-event.dto");
let AnalyticsController = class AnalyticsController {
    constructor(analyticsService, aggregationService) {
        this.analyticsService = analyticsService;
        this.aggregationService = aggregationService;
    }
    async trackEvent(dto, req) {
        const userAgent = req.headers['user-agent'] || undefined;
        await this.analyticsService.recordEvent(dto, userAgent);
    }
    getMenuSummary(menuId, userId) {
        return this.analyticsService.getSummary(menuId, userId);
    }
    getBusinessAnalytics(businessId, userId) {
        return this.analyticsService.getBusinessAnalytics(businessId, userId);
    }
    runDailySnapshots(date) {
        return this.aggregationService.generateDailySnapshots(date ? new Date(date) : undefined);
    }
};
exports.AnalyticsController = AnalyticsController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('event'),
    (0, common_1.HttpCode)(204),
    (0, throttler_1.Throttle)({ default: { limit: 60, ttl: 60_000 } }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [track_event_dto_1.TrackEventDto, Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "trackEvent", null);
__decorate([
    (0, common_1.Get)('menu/:menuId'),
    __param(0, (0, common_1.Param)('menuId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "getMenuSummary", null);
__decorate([
    (0, common_1.Get)('business/:businessId'),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "getBusinessAnalytics", null);
__decorate([
    (0, common_1.Post)('snapshots/run'),
    __param(0, (0, common_1.Body)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "runDailySnapshots", null);
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, common_1.Controller)('analytics'),
    __metadata("design:paramtypes", [analytics_service_1.AnalyticsService,
        aggregation_service_1.AggregationService])
], AnalyticsController);
//# sourceMappingURL=analytics.controller.js.map