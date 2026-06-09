import { PrismaService } from '../prisma/prisma.service';
export declare class CreateCategoryDto {
    name: string;
    description?: string;
    imageUrl?: string;
}
export declare class UpdateCategoryDto {
    name?: string;
    description?: string;
    imageUrl?: string;
    isActive?: boolean;
}
export declare class ReorderDto {
    ids: string[];
}
export declare class CategoryService {
    private prisma;
    constructor(prisma: PrismaService);
    create(menuId: string, userId: string, dto: CreateCategoryDto): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        imageUrl: string | null;
        sortOrder: number;
        menuId: string;
    }>;
    findAll(menuId: string, userId: string): Promise<({
        translations: {
            id: string;
            categoryId: string | null;
            productId: string | null;
            language: import(".prisma/client").$Enums.Language;
            entityType: string;
            entityId: string;
            field: string;
            value: string;
        }[];
        _count: {
            products: number;
        };
    } & {
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        imageUrl: string | null;
        sortOrder: number;
        menuId: string;
    })[]>;
    update(id: string, userId: string, dto: UpdateCategoryDto): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        imageUrl: string | null;
        sortOrder: number;
        menuId: string;
    }>;
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
    reorder(menuId: string, userId: string, dto: ReorderDto): Promise<{
        message: string;
    }>;
    private checkMenuOwnership;
    private checkCategoryOwnership;
}
