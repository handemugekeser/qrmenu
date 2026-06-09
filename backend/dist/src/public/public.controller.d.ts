import { PublicMenuService } from './public.service';
import { Request } from 'express';
export declare class PublicController {
    private publicMenuService;
    constructor(publicMenuService: PublicMenuService);
    getMenu(slug: string, lang: string, table: string, menuId: string, req: Request): Promise<{
        business: {
            name: string;
            description: string;
            logoUrl: string;
            coverUrl: string;
            currency: string;
            phone: string;
            socialLinks: import("@prisma/client/runtime/library").JsonValue;
        };
        menu: any;
    }>;
}
