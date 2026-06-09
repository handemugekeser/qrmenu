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
exports.InsightCacheStore = void 0;
const crypto_1 = require("crypto");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const TTL_DAYS = 7;
const MS_PER_DAY = 24 * 60 * 60 * 1000;
let InsightCacheStore = class InsightCacheStore {
    constructor(prisma) {
        this.prisma = prisma;
    }
    static keyOf(ruleId, rawData) {
        const canonical = canonicalize(rawData);
        return (0, crypto_1.createHash)('sha256').update(`${ruleId}:${canonical}`).digest('hex');
    }
    async get(key) {
        const row = await this.prisma.insightCache.findUnique({ where: { key } });
        if (!row)
            return null;
        if (row.expiresAt.getTime() <= Date.now()) {
            await this.prisma.insightCache.delete({ where: { key } }).catch(() => undefined);
            return null;
        }
        return { title: row.title, body: row.body };
    }
    async set(key, ruleId, value) {
        const expiresAt = new Date(Date.now() + TTL_DAYS * MS_PER_DAY);
        await this.prisma.insightCache.upsert({
            where: { key },
            create: { key, ruleId, title: value.title, body: value.body, expiresAt },
            update: { title: value.title, body: value.body, expiresAt },
        });
    }
};
exports.InsightCacheStore = InsightCacheStore;
exports.InsightCacheStore = InsightCacheStore = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InsightCacheStore);
function canonicalize(value) {
    if (value === null || typeof value !== 'object')
        return JSON.stringify(value);
    if (Array.isArray(value))
        return `[${value.map(canonicalize).join(',')}]`;
    const obj = value;
    const keys = Object.keys(obj).sort();
    return `{${keys.map((k) => `${JSON.stringify(k)}:${canonicalize(obj[k])}`).join(',')}}`;
}
//# sourceMappingURL=cache.js.map