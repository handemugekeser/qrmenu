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
exports.CategoryService = exports.ReorderDto = exports.UpdateCategoryDto = exports.CreateCategoryDto = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const class_validator_1 = require("class-validator");
class CreateCategoryDto {
}
exports.CreateCategoryDto = CreateCategoryDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCategoryDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCategoryDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCategoryDto.prototype, "imageUrl", void 0);
class UpdateCategoryDto {
}
exports.UpdateCategoryDto = UpdateCategoryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCategoryDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCategoryDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCategoryDto.prototype, "imageUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateCategoryDto.prototype, "isActive", void 0);
class ReorderDto {
}
exports.ReorderDto = ReorderDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], ReorderDto.prototype, "ids", void 0);
let CategoryService = class CategoryService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(menuId, userId, dto) {
        await this.checkMenuOwnership(menuId, userId);
        const count = await this.prisma.category.count({ where: { menuId } });
        return this.prisma.category.create({
            data: { ...dto, menuId, sortOrder: count },
        });
    }
    async findAll(menuId, userId) {
        await this.checkMenuOwnership(menuId, userId);
        return this.prisma.category.findMany({
            where: { menuId },
            include: {
                _count: { select: { products: true } },
                translations: true,
            },
            orderBy: { sortOrder: 'asc' },
        });
    }
    async update(id, userId, dto) {
        await this.checkCategoryOwnership(id, userId);
        return this.prisma.category.update({ where: { id }, data: dto });
    }
    async remove(id, userId) {
        await this.checkCategoryOwnership(id, userId);
        await this.prisma.category.delete({ where: { id } });
        return { message: 'Category deleted' };
    }
    async reorder(menuId, userId, dto) {
        await this.checkMenuOwnership(menuId, userId);
        const updates = dto.ids.map((id, index) => this.prisma.category.update({ where: { id }, data: { sortOrder: index } }));
        await this.prisma.$transaction(updates);
        return { message: 'Reordered successfully' };
    }
    async checkMenuOwnership(menuId, userId) {
        const menu = await this.prisma.menu.findFirst({ where: { id: menuId, business: { userId } } });
        if (!menu)
            throw new common_1.NotFoundException('Menu not found');
        return menu;
    }
    async checkCategoryOwnership(id, userId) {
        const cat = await this.prisma.category.findFirst({
            where: { id, menu: { business: { userId } } },
        });
        if (!cat)
            throw new common_1.NotFoundException('Category not found');
        return cat;
    }
};
exports.CategoryService = CategoryService;
exports.CategoryService = CategoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoryService);
//# sourceMappingURL=category.service.js.map