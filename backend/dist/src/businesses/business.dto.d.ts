import { Language } from '@prisma/client';
export declare class CreateBusinessDto {
    name: string;
    slug: string;
    description?: string;
    phone?: string;
    address?: string;
    currency?: string;
}
export declare class UpdateBusinessDto {
    name?: string;
    description?: string;
    phone?: string;
    address?: string;
    logoUrl?: string;
    coverUrl?: string;
    currency?: string;
    defaultLang?: Language;
    socialLinks?: {
        instagram?: string;
        facebook?: string;
        twitter?: string;
        tiktok?: string;
        youtube?: string;
    };
}
