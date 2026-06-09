import { PrismaService } from '../prisma/prisma.service';
import { Language } from '@prisma/client';
export declare class UpsertTranslationDto {
    entityType: 'category' | 'product';
    entityId: string;
    language: Language;
    field: string;
    value: string;
}
export declare class TranslationService {
    private prisma;
    constructor(prisma: PrismaService);
    upsert(userId: string, dto: UpsertTranslationDto): Promise<{
        id: string;
        categoryId: string | null;
        productId: string | null;
        language: import(".prisma/client").$Enums.Language;
        entityType: string;
        entityId: string;
        field: string;
        value: string;
    }>;
    findForEntity(entityType: string, entityId: string, userId: string): Promise<{
        id: string;
        categoryId: string | null;
        productId: string | null;
        language: import(".prisma/client").$Enums.Language;
        entityType: string;
        entityId: string;
        field: string;
        value: string;
    }[]>;
    deleteTranslation(id: string, userId: string): Promise<{
        message: string;
    }>;
}
