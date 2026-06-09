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
exports.BusinessService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const plan_limits_constants_1 = require("../common/plan-limits.constants");
let BusinessService = class BusinessService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { plan: true } });
        const limits = plan_limits_constants_1.PLAN_LIMITS[user.plan];
        if (limits.maxBusinesses !== -1) {
            const count = await this.prisma.business.count({ where: { userId } });
            if (count >= limits.maxBusinesses) {
                throw new common_1.ForbiddenException(`Plan limitine ulaştınız. ${user.plan === 'FREE' ? 'Pro' : 'Premium'} aboneliğe geçerek daha fazla işletme ekleyebilirsiniz.`);
            }
        }
        const slugTaken = await this.prisma.business.findUnique({ where: { slug: dto.slug } });
        if (slugTaken)
            throw new common_1.ConflictException('This slug is already taken');
        return this.prisma.business.create({
            data: { ...dto, userId },
        });
    }
    async findAllByUser(userId) {
        return this.prisma.business.findMany({
            where: { userId },
            include: {
                menus: { select: { id: true, name: true, isActive: true } },
                _count: { select: { menus: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id, userId) {
        const business = await this.prisma.business.findFirst({
            where: { id, userId },
            include: {
                menus: {
                    include: {
                        _count: { select: { categories: true, qrCodes: true } },
                    },
                },
            },
        });
        if (!business)
            throw new common_1.NotFoundException('Business not found');
        return business;
    }
    async update(id, userId, dto) {
        await this.checkOwnership(id, userId);
        return this.prisma.business.update({
            where: { id },
            data: dto,
        });
    }
    async remove(id, userId) {
        await this.checkOwnership(id, userId);
        await this.prisma.business.delete({ where: { id } });
        return { message: 'Business deleted' };
    }
    async checkSlugAvailability(slug) {
        const exists = await this.prisma.business.findUnique({ where: { slug } });
        return { available: !exists };
    }
    async checkOwnership(id, userId) {
        const business = await this.prisma.business.findFirst({ where: { id, userId } });
        if (!business)
            throw new common_1.NotFoundException('Business not found');
        return business;
    }
};
exports.BusinessService = BusinessService;
exports.BusinessService = BusinessService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BusinessService);
//# sourceMappingURL=business.service.js.map