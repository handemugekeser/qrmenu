import { PrismaService } from '../prisma/prisma.service';
export declare class CreateQrCodeDto {
    label?: string;
    tableNumber?: number;
}
export declare class QrCodeService {
    private prisma;
    constructor(prisma: PrismaService);
    generate(menuId: string, userId: string, dto: CreateQrCodeDto): Promise<{
        id: string;
        createdAt: Date;
        imageUrl: string | null;
        menuId: string;
        tableNumber: number | null;
        label: string | null;
        url: string;
        scanCount: number;
    }>;
    findAll(menuId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        imageUrl: string | null;
        menuId: string;
        tableNumber: number | null;
        label: string | null;
        url: string;
        scanCount: number;
    }[]>;
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
    incrementScan(id: string): Promise<{
        id: string;
        createdAt: Date;
        imageUrl: string | null;
        menuId: string;
        tableNumber: number | null;
        label: string | null;
        url: string;
        scanCount: number;
    }>;
    generatePreview(url: string): Promise<string>;
}
