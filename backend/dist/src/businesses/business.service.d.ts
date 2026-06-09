import { PrismaService } from '../prisma/prisma.service';
import { CreateBusinessDto, UpdateBusinessDto } from './business.dto';
export declare class BusinessService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreateBusinessDto): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        userId: string;
        description: string | null;
        phone: string | null;
        address: string | null;
        logoUrl: string | null;
        coverUrl: string | null;
        currency: string;
        defaultLang: import(".prisma/client").$Enums.Language;
        socialLinks: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    findAllByUser(userId: string): Promise<({
        menus: {
            id: string;
            name: string;
            isActive: boolean;
        }[];
        _count: {
            menus: number;
        };
    } & {
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        userId: string;
        description: string | null;
        phone: string | null;
        address: string | null;
        logoUrl: string | null;
        coverUrl: string | null;
        currency: string;
        defaultLang: import(".prisma/client").$Enums.Language;
        socialLinks: import("@prisma/client/runtime/library").JsonValue | null;
    })[]>;
    findOne(id: string, userId: string): Promise<{
        menus: ({
            _count: {
                categories: number;
                qrCodes: number;
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
        })[];
    } & {
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        userId: string;
        description: string | null;
        phone: string | null;
        address: string | null;
        logoUrl: string | null;
        coverUrl: string | null;
        currency: string;
        defaultLang: import(".prisma/client").$Enums.Language;
        socialLinks: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    update(id: string, userId: string, dto: UpdateBusinessDto): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        userId: string;
        description: string | null;
        phone: string | null;
        address: string | null;
        logoUrl: string | null;
        coverUrl: string | null;
        currency: string;
        defaultLang: import(".prisma/client").$Enums.Language;
        socialLinks: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
    checkSlugAvailability(slug: string): Promise<{
        available: boolean;
    }>;
    private checkOwnership;
}
