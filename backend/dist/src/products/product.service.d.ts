import { PrismaService } from '../prisma/prisma.service';
export declare class CreateProductDto {
    name: string;
    description?: string;
    imageUrl?: string;
    basePrice: number;
    calories?: number;
    allergens?: string[];
    isAvailable?: boolean;
    isPopular?: boolean;
    variants?: {
        name: string;
        price: number;
        isDefault?: boolean;
    }[];
    extras?: {
        name: string;
        price: number;
        isRequired?: boolean;
        maxSelect?: number;
    }[];
}
export declare class UpdateProductDto {
    name?: string;
    description?: string;
    imageUrl?: string;
    basePrice?: number;
    calories?: number;
    allergens?: string[];
    isAvailable?: boolean;
    isPopular?: boolean;
}
export declare class CreateVariantDto {
    name: string;
    price: number;
    isDefault?: boolean;
}
export declare class CreateExtraDto {
    name: string;
    price: number;
    isRequired?: boolean;
    maxSelect?: number;
}
export declare class ReorderProductsDto {
    ids: string[];
}
export declare class ProductService {
    private prisma;
    constructor(prisma: PrismaService);
    create(categoryId: string, userId: string, dto: CreateProductDto): Promise<{
        variants: {
            id: string;
            name: string;
            isDefault: boolean;
            sortOrder: number;
            productId: string;
            price: import("@prisma/client/runtime/library").Decimal;
        }[];
        extras: {
            id: string;
            name: string;
            sortOrder: number;
            productId: string;
            price: import("@prisma/client/runtime/library").Decimal;
            isRequired: boolean;
            maxSelect: number;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        imageUrl: string | null;
        sortOrder: number;
        basePrice: import("@prisma/client/runtime/library").Decimal;
        calories: number | null;
        allergens: string[];
        isAvailable: boolean;
        isPopular: boolean;
        categoryId: string;
    }>;
    findAll(categoryId: string, userId: string): Promise<({
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
        variants: {
            id: string;
            name: string;
            isDefault: boolean;
            sortOrder: number;
            productId: string;
            price: import("@prisma/client/runtime/library").Decimal;
        }[];
        extras: {
            id: string;
            name: string;
            sortOrder: number;
            productId: string;
            price: import("@prisma/client/runtime/library").Decimal;
            isRequired: boolean;
            maxSelect: number;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        imageUrl: string | null;
        sortOrder: number;
        basePrice: import("@prisma/client/runtime/library").Decimal;
        calories: number | null;
        allergens: string[];
        isAvailable: boolean;
        isPopular: boolean;
        categoryId: string;
    })[]>;
    findOne(id: string, userId: string): Promise<{
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
        variants: {
            id: string;
            name: string;
            isDefault: boolean;
            sortOrder: number;
            productId: string;
            price: import("@prisma/client/runtime/library").Decimal;
        }[];
        extras: {
            id: string;
            name: string;
            sortOrder: number;
            productId: string;
            price: import("@prisma/client/runtime/library").Decimal;
            isRequired: boolean;
            maxSelect: number;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        imageUrl: string | null;
        sortOrder: number;
        basePrice: import("@prisma/client/runtime/library").Decimal;
        calories: number | null;
        allergens: string[];
        isAvailable: boolean;
        isPopular: boolean;
        categoryId: string;
    }>;
    update(id: string, userId: string, dto: UpdateProductDto): Promise<{
        variants: {
            id: string;
            name: string;
            isDefault: boolean;
            sortOrder: number;
            productId: string;
            price: import("@prisma/client/runtime/library").Decimal;
        }[];
        extras: {
            id: string;
            name: string;
            sortOrder: number;
            productId: string;
            price: import("@prisma/client/runtime/library").Decimal;
            isRequired: boolean;
            maxSelect: number;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        imageUrl: string | null;
        sortOrder: number;
        basePrice: import("@prisma/client/runtime/library").Decimal;
        calories: number | null;
        allergens: string[];
        isAvailable: boolean;
        isPopular: boolean;
        categoryId: string;
    }>;
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
    reorder(categoryId: string, userId: string, dto: ReorderProductsDto): Promise<{
        message: string;
    }>;
    addVariant(productId: string, userId: string, dto: CreateVariantDto): Promise<{
        id: string;
        name: string;
        isDefault: boolean;
        sortOrder: number;
        productId: string;
        price: import("@prisma/client/runtime/library").Decimal;
    }>;
    updateVariant(variantId: string, userId: string, data: Partial<CreateVariantDto>): Promise<{
        id: string;
        name: string;
        isDefault: boolean;
        sortOrder: number;
        productId: string;
        price: import("@prisma/client/runtime/library").Decimal;
    }>;
    removeVariant(variantId: string, userId: string): Promise<{
        message: string;
    }>;
    addExtra(productId: string, userId: string, dto: CreateExtraDto): Promise<{
        id: string;
        name: string;
        sortOrder: number;
        productId: string;
        price: import("@prisma/client/runtime/library").Decimal;
        isRequired: boolean;
        maxSelect: number;
    }>;
    updateExtra(extraId: string, userId: string, data: Partial<CreateExtraDto>): Promise<{
        id: string;
        name: string;
        sortOrder: number;
        productId: string;
        price: import("@prisma/client/runtime/library").Decimal;
        isRequired: boolean;
        maxSelect: number;
    }>;
    removeExtra(extraId: string, userId: string): Promise<{
        message: string;
    }>;
    private checkCategoryOwnership;
    private checkProductOwnership;
}
