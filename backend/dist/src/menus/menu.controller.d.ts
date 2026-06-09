import { MenuService, CreateMenuDto, UpdateMenuDto } from './menu.service';
export declare class MenuController {
    private menuService;
    constructor(menuService: MenuService);
    create(businessId: string, userId: string, dto: CreateMenuDto): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        isDefault: boolean;
        themeColor: string;
        businessId: string;
    }>;
    findAll(businessId: string, userId: string): Promise<({
        _count: {
            categories: number;
            qrCodes: number;
            analytics: number;
        };
    } & {
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        isDefault: boolean;
        themeColor: string;
        businessId: string;
    })[]>;
    findOne(id: string, userId: string): Promise<{
        categories: ({
            products: ({
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
            })[];
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
        })[];
        _count: {
            qrCodes: number;
            analytics: number;
        };
    } & {
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        isDefault: boolean;
        themeColor: string;
        businessId: string;
    }>;
    update(id: string, userId: string, dto: UpdateMenuDto): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        isDefault: boolean;
        themeColor: string;
        businessId: string;
    }>;
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
}
