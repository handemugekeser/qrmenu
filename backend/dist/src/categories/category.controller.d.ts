import { CategoryService, CreateCategoryDto, UpdateCategoryDto, ReorderDto } from './category.service';
export declare class CategoryController {
    private categoryService;
    constructor(categoryService: CategoryService);
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
    reorder(menuId: string, userId: string, dto: ReorderDto): Promise<{
        message: string;
    }>;
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
}
