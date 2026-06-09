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
var LlmInsightService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LlmInsightService = exports.FAILED_TITLE = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../../../prisma/prisma.service");
const cache_1 = require("./cache");
const llm_client_1 = require("./llm.client");
exports.FAILED_TITLE = '(öneri üretilemedi)';
let LlmInsightService = LlmInsightService_1 = class LlmInsightService {
    constructor(client, cache, prisma) {
        this.client = client;
        this.cache = cache;
        this.prisma = prisma;
        this.logger = new common_1.Logger(LlmInsightService_1.name);
    }
    async generateOrPlaceholder(ruleId, rawData) {
        const key = cache_1.InsightCacheStore.keyOf(ruleId, rawData);
        const hit = await this.cache.get(key);
        if (hit)
            return { ...hit, failed: false };
        try {
            const generated = await this.client.generate(ruleId, rawData);
            await this.cache.set(key, ruleId, generated);
            return { ...generated, failed: false };
        }
        catch (err) {
            this.logger.error(`LLM generation failed for rule=${ruleId}: ${err.message}`);
            return {
                title: exports.FAILED_TITLE,
                body: JSON.stringify(rawData),
                failed: true,
            };
        }
    }
    async retryFailedInsights() {
        const failed = await this.prisma.insight.findMany({
            where: { status: 'NEW', title: exports.FAILED_TITLE },
            take: 100,
            orderBy: { createdAt: 'asc' },
        });
        if (failed.length === 0)
            return { retried: 0, fixed: 0 };
        let fixed = 0;
        for (const insight of failed) {
            const rawData = insight.rawData;
            try {
                const generated = await this.client.generate(insight.ruleId, rawData);
                const key = cache_1.InsightCacheStore.keyOf(insight.ruleId, rawData);
                await this.cache.set(key, insight.ruleId, generated);
                await this.prisma.insight.update({
                    where: { id: insight.id },
                    data: { title: generated.title, body: generated.body },
                });
                fixed++;
            }
            catch (err) {
                this.logger.warn(`Retry failed for insight=${insight.id} rule=${insight.ruleId}: ${err.message}`);
            }
        }
        this.logger.log(`Insight retry: ${fixed}/${failed.length} fixed`);
        return { retried: failed.length, fixed };
    }
};
exports.LlmInsightService = LlmInsightService;
__decorate([
    (0, schedule_1.Cron)('15 3 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LlmInsightService.prototype, "retryFailedInsights", null);
exports.LlmInsightService = LlmInsightService = LlmInsightService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [llm_client_1.LlmClient,
        cache_1.InsightCacheStore,
        prisma_service_1.PrismaService])
], LlmInsightService);
//# sourceMappingURL=llm.service.js.map