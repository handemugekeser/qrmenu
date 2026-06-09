import { ProductService, CreateProductDto, UpdateProductDto, CreateVariantDto, CreateExtraDto, ReorderProductsDto } from './product.service';
export declare class ProductController {
    private productService;
    constructor(productService: ProductService);
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
    reorder(catId: string, userId: string, dto: ReorderProductsDto): Promise<{
        message: string;
    }>;
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
    addVariant(id: string, userId: string, dto: CreateVariantDto): Promise<{
        id: string;
        name: string;
        isDefault: boolean;
        sortOrder: number;
        productId: string;
        price: import("@prisma/client/runtime/library").Decimal;
    }>;
    updateVariant(vid: string, userId: string, dto: Partial<CreateVariantDto>): Promise<{
        id: string;
        name: string;
        isDefault: boolean;
        sortOrder: number;
        productId: string;
        price: import("@prisma/client/runtime/library").Decimal;
    }>;
    removeVariant(vid: string, userId: string): Promise<{
        message: string;
    }>;
    addExtra(id: string, userId: string, dto: CreateExtraDto): Promise<{
        id: string;
        name: string;
        sortOrder: number;
        productId: string;
        price: import("@prisma/client/runtime/library").Decimal;
        isRequired: boolean;
        maxSelect: number;
    }>;
    updateExtra(eid: string, userId: string, dto: Partial<CreateExtraDto>): Promise<{
        id: string;
        name: string;
        sortOrder: number;
        productId: string;
        price: import("@prisma/client/runtime/library").Decimal;
        isRequired: boolean;
        maxSelect: number;
    }>;
    removeExtra(eid: string, userId: string): Promise<{
        message: string;
    }>;
}
