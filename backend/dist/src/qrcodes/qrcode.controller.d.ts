import { QrCodeService, CreateQrCodeDto } from './qrcode.service';
export declare class QrCodeController {
    private qrCodeService;
    constructor(qrCodeService: QrCodeService);
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
}
