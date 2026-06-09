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
exports.ProductService = exports.ReorderProductsDto = exports.CreateExtraDto = exports.CreateVariantDto = exports.UpdateProductDto = exports.CreateProductDto = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const plan_limits_constants_1 = require("../common/plan-limits.constants");
const class_validator_1 = require("class-validator");
class CreateProductDto {
}
exports.CreateProductDto = CreateProductDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "imageUrl", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "basePrice", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "calories", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateProductDto.prototype, "allergens", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateProductDto.prototype, "isAvailable", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateProductDto.prototype, "isPopular", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateProductDto.prototype, "variants", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateProductDto.prototype, "extras", void 0);
class UpdateProductDto {
}
exports.UpdateProductDto = UpdateProductDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "imageUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateProductDto.prototype, "basePrice", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateProductDto.prototype, "calories", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], UpdateProductDto.prototype, "allergens", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateProductDto.prototype, "isAvailable", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateProductDto.prototype, "isPopular", void 0);
class CreateVariantDto {
}
exports.CreateVariantDto = CreateVariantDto;
class CreateExtraDto {
}
exports.CreateExtraDto = CreateExtraDto;
class ReorderProductsDto {
}
exports.ReorderProductsDto = ReorderProductsDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], ReorderProductsDto.prototype, "ids", void 0);
let ProductService = class ProductService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(categoryId, userId, dto) {
        await this.checkCategoryOwnership(categoryId, userId);
        const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { plan: true } });
        const limits = plan_limits_constants_1.PLAN_LIMITS[user.plan];
        if (limits.maxProducts !== -1) {
            const totalProducts = await this.prisma.product.count({
                where: { category: { menu: { business: { userId } } } },
            });
            if (totalProducts >= limits.maxProducts) {
                throw new common_1.ForbiddenException(`Plan limitine ulaştınız. ${user.plan === 'FREE' ? 'Pro' : 'Premium'} aboneliğe geçerek daha fazla ürün ekleyebilirsiniz.`);
            }
        }
        const count = await this.prisma.product.count({ where: { categoryId } });
        const { variants, extras, ...productData } = dto;
        return this.prisma.product.create({
            data: {
                ...productData,
                categoryId,
                sortOrder: count,
                variants: variants ? { create: variants.map((v, i) => ({ ...v, sortOrder: i })) } : undefined,
                extras: extras ? { create: extras.map((e, i) => ({ ...e, sortOrder: i })) } : undefined,
            },
            include: { variants: true, extras: true },
        });
    }
    async findAll(categoryId, userId) {
        await this.checkCategoryOwnership(categoryId, userId);
        return this.prisma.product.findMany({
            where: { categoryId },
            include: { variants: { orderBy: { sortOrder: 'asc' } }, extras: { orderBy: { sortOrder: 'asc' } }, translations: true },
            orderBy: { sortOrder: 'asc' },
        });
    }
    async findOne(id, userId) {
        const product = await this.prisma.product.findFirst({
            where: { id, category: { menu: { business: { userId } } } },
            include: { variants: true, extras: true, translations: true },
        });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        return product;
    }
    async update(id, userId, dto) {
        await this.checkProductOwnership(id, userId);
        return this.prisma.product.update({
            where: { id },
            data: dto,
            include: { variants: true, extras: true },
        });
    }
    async remove(id, userId) {
        await this.checkProductOwnership(id, userId);
        await this.prisma.product.delete({ where: { id } });
        return { message: 'Product deleted' };
    }
    async reorder(categoryId, userId, dto) {
        await this.checkCategoryOwnership(categoryId, userId);
        const updates = dto.ids.map((id, index) => this.prisma.product.update({ where: { id }, data: { sortOrder: index } }));
        await this.prisma.$transaction(updates);
        return { message: 'Reordered successfully' };
    }
    async addVariant(productId, userId, dto) {
        await this.checkProductOwnership(productId, userId);
        if (dto.isDefault) {
            await this.prisma.variant.updateMany({ where: { productId }, data: { isDefault: false } });
        }
        return this.prisma.variant.create({ data: { ...dto, productId } });
    }
    async updateVariant(variantId, userId, data) {
        const variant = await this.prisma.variant.findFirst({
            where: { id: variantId, product: { category: { menu: { business: { userId } } } } },
        });
        if (!variant)
            throw new common_1.NotFoundException('Variant not found');
        return this.prisma.variant.update({ where: { id: variantId }, data });
    }
    async removeVariant(variantId, userId) {
        const variant = await this.prisma.variant.findFirst({
            where: { id: variantId, product: { category: { menu: { business: { userId } } } } },
        });
        if (!variant)
            throw new common_1.NotFoundException('Variant not found');
        await this.prisma.variant.delete({ where: { id: variantId } });
        return { message: 'Variant deleted' };
    }
    async addExtra(productId, userId, dto) {
        await this.checkProductOwnership(productId, userId);
        return this.prisma.extra.create({ data: { ...dto, productId } });
    }
    async updateExtra(extraId, userId, data) {
        const extra = await this.prisma.extra.findFirst({
            where: { id: extraId, product: { category: { menu: { business: { userId } } } } },
        });
        if (!extra)
            throw new common_1.NotFoundException('Extra not found');
        return this.prisma.extra.update({ where: { id: extraId }, data });
    }
    async removeExtra(extraId, userId) {
        const extra = await this.prisma.extra.findFirst({
            where: { id: extraId, product: { category: { menu: { business: { userId } } } } },
        });
        if (!extra)
            throw new common_1.NotFoundException('Extra not found');
        await this.prisma.extra.delete({ where: { id: extraId } });
        return { message: 'Extra deleted' };
    }
    async checkCategoryOwnership(categoryId, userId) {
        const cat = await this.prisma.category.findFirst({
            where: { id: categoryId, menu: { business: { userId } } },
        });
        if (!cat)
            throw new common_1.NotFoundException('Category not found');
        return cat;
    }
    async checkProductOwnership(productId, userId) {
        const product = await this.prisma.product.findFirst({
            where: { id: productId, category: { menu: { business: { userId } } } },
        });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        return product;
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductService);
//# sourceMappingURL=product.service.js.map