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
exports.TranslationService = exports.UpsertTranslationDto = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
class UpsertTranslationDto {
}
exports.UpsertTranslationDto = UpsertTranslationDto;
let TranslationService = class TranslationService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async upsert(userId, dto) {
        if (dto.entityType === 'category') {
            const cat = await this.prisma.category.findFirst({
                where: { id: dto.entityId, menu: { business: { userId } } },
            });
            if (!cat)
                throw new common_1.NotFoundException('Category not found');
        }
        else {
            const prod = await this.prisma.product.findFirst({
                where: { id: dto.entityId, category: { menu: { business: { userId } } } },
            });
            if (!prod)
                throw new common_1.NotFoundException('Product not found');
        }
        const relField = dto.entityType === 'category'
            ? { categoryId: dto.entityId }
            : { productId: dto.entityId };
        return this.prisma.translation.upsert({
            where: {
                entityType_entityId_language_field: {
                    entityType: dto.entityType,
                    entityId: dto.entityId,
                    language: dto.language,
                    field: dto.field,
                },
            },
            update: { value: dto.value },
            create: { ...dto, ...relField },
        });
    }
    async findForEntity(entityType, entityId, userId) {
        return this.prisma.translation.findMany({
            where: { entityType, entityId },
        });
    }
    async deleteTranslation(id, userId) {
        const t = await this.prisma.translation.findUnique({ where: { id } });
        if (!t)
            throw new common_1.NotFoundException('Translation not found');
        await this.prisma.translation.delete({ where: { id } });
        return { message: 'Translation deleted' };
    }
};
exports.TranslationService = TranslationService;
exports.TranslationService = TranslationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TranslationService);
//# sourceMappingURL=translation.service.js.map