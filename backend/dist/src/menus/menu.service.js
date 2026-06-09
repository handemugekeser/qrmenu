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
exports.MenuService = exports.UpdateMenuDto = exports.CreateMenuDto = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const class_validator_1 = require("class-validator");
const plan_limits_constants_1 = require("../common/plan-limits.constants");
class CreateMenuDto {
}
exports.CreateMenuDto = CreateMenuDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMenuDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMenuDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMenuDto.prototype, "themeColor", void 0);
class UpdateMenuDto {
}
exports.UpdateMenuDto = UpdateMenuDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMenuDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMenuDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateMenuDto.prototype, "isActive", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateMenuDto.prototype, "isDefault", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMenuDto.prototype, "themeColor", void 0);
let MenuService = class MenuService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(businessId, userId, dto) {
        await this.checkBusinessOwnership(businessId, userId);
        const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { plan: true } });
        const limits = plan_limits_constants_1.PLAN_LIMITS[user.plan];
        if (limits.maxMenus !== -1) {
            const count = await this.prisma.menu.count({ where: { business: { userId } } });
            if (count >= limits.maxMenus) {
                throw new common_1.ForbiddenException(`Plan limitine ulaştınız. ${user.plan === 'FREE' ? 'Pro' : 'Premium'} aboneliğe geçerek daha fazla menü ekleyebilirsiniz.`);
            }
        }
        return this.prisma.menu.create({
            data: { ...dto, businessId },
        });
    }
    async findAll(businessId, userId) {
        await this.checkBusinessOwnership(businessId, userId);
        return this.prisma.menu.findMany({
            where: { businessId },
            include: {
                _count: { select: { categories: true, qrCodes: true, analytics: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id, userId) {
        const menu = await this.prisma.menu.findFirst({
            where: { id, business: { userId } },
            include: {
                categories: {
                    include: {
                        products: {
                            include: { variants: true, extras: true },
                            orderBy: { sortOrder: 'asc' },
                        },
                    },
                    orderBy: { sortOrder: 'asc' },
                },
                _count: { select: { qrCodes: true, analytics: true } },
            },
        });
        if (!menu)
            throw new common_1.NotFoundException('Menu not found');
        return menu;
    }
    async update(id, userId, dto) {
        await this.checkMenuOwnership(id, userId);
        if (dto.isDefault) {
            const menu = await this.prisma.menu.findUnique({ where: { id } });
            await this.prisma.menu.updateMany({
                where: { businessId: menu.businessId, isDefault: true },
                data: { isDefault: false },
            });
        }
        return this.prisma.menu.update({ where: { id }, data: dto });
    }
    async remove(id, userId) {
        await this.checkMenuOwnership(id, userId);
        await this.prisma.menu.delete({ where: { id } });
        return { message: 'Menu deleted' };
    }
    async checkBusinessOwnership(businessId, userId) {
        const business = await this.prisma.business.findFirst({ where: { id: businessId, userId } });
        if (!business)
            throw new common_1.NotFoundException('Business not found');
        return business;
    }
    async checkMenuOwnership(id, userId) {
        const menu = await this.prisma.menu.findFirst({ where: { id, business: { userId } } });
        if (!menu)
            throw new common_1.NotFoundException('Menu not found');
        return menu;
    }
};
exports.MenuService = MenuService;
exports.MenuService = MenuService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MenuService);
//# sourceMappingURL=menu.service.js.map