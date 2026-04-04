import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Language } from '@prisma/client';

export class UpsertTranslationDto {
  entityType: 'category' | 'product';
  entityId: string;
  language: Language;
  field: string;
  value: string;
}

@Injectable()
export class TranslationService {
  constructor(private prisma: PrismaService) {}

  async upsert(userId: string, dto: UpsertTranslationDto) {
    // Verify ownership
    if (dto.entityType === 'category') {
      const cat = await this.prisma.category.findFirst({
        where: { id: dto.entityId, menu: { business: { userId } } },
      });
      if (!cat) throw new NotFoundException('Category not found');
    } else {
      const prod = await this.prisma.product.findFirst({
        where: { id: dto.entityId, category: { menu: { business: { userId } } } },
      });
      if (!prod) throw new NotFoundException('Product not found');
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

  async findForEntity(entityType: string, entityId: string, userId: string) {
    return this.prisma.translation.findMany({
      where: { entityType, entityId },
    });
  }

  async deleteTranslation(id: string, userId: string) {
    const t = await this.prisma.translation.findUnique({ where: { id } });
    if (!t) throw new NotFoundException('Translation not found');
    await this.prisma.translation.delete({ where: { id } });
    return { message: 'Translation deleted' };
  }
}
