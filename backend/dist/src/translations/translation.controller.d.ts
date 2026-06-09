import { TranslationService, UpsertTranslationDto } from './translation.service';
export declare class TranslationController {
    private translationService;
    constructor(translationService: TranslationService);
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
    delete(id: string, userId: string): Promise<{
        message: string;
    }>;
}
