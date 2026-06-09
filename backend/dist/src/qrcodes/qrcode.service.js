"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QrCodeService = exports.CreateQrCodeDto = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const plan_limits_constants_1 = require("../common/plan-limits.constants");
const QRCode = __importStar(require("qrcode"));
const uuid_1 = require("uuid");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const class_validator_1 = require("class-validator");
class CreateQrCodeDto {
}
exports.CreateQrCodeDto = CreateQrCodeDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateQrCodeDto.prototype, "label", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateQrCodeDto.prototype, "tableNumber", void 0);
let QrCodeService = class QrCodeService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generate(menuId, userId, dto) {
        const menu = await this.prisma.menu.findFirst({
            where: { id: menuId, business: { userId } },
            include: { business: { include: { user: { select: { plan: true } } } } },
        });
        if (!menu)
            throw new common_1.NotFoundException('Menu not found');
        if (dto.tableNumber) {
            const limits = plan_limits_constants_1.PLAN_LIMITS[menu.business.user.plan];
            if (!limits.tableQr) {
                throw new common_1.ForbiddenException('Masa QR kodu özelliği Pro veya Premium plana özeldir. Yükseltme yaparak bu özelliği kullanabilirsiniz.');
            }
        }
        const baseUrl = process.env.PUBLIC_URL || 'http://localhost:3000';
        const tableParam = dto.tableNumber ? `?table=${dto.tableNumber}` : '';
        const url = `${baseUrl}/menu/${menu.business.slug}${tableParam}`;
        const qrDataUrl = await QRCode.toDataURL(url, {
            width: 400,
            margin: 2,
            color: {
                dark: '#1a1a2e',
                light: '#ffffff',
            },
        });
        const uploadsDir = path.join(process.cwd(), 'uploads', 'qrcodes');
        if (!fs.existsSync(uploadsDir))
            fs.mkdirSync(uploadsDir, { recursive: true });
        const filename = `qr-${(0, uuid_1.v4)()}.png`;
        const filepath = path.join(uploadsDir, filename);
        const base64Data = qrDataUrl.replace(/^data:image\/png;base64,/, '');
        fs.writeFileSync(filepath, base64Data, 'base64');
        const imageUrl = `/uploads/qrcodes/${filename}`;
        return this.prisma.qrCode.create({
            data: {
                menuId,
                label: dto.label,
                tableNumber: dto.tableNumber,
                url,
                imageUrl,
            },
        });
    }
    async findAll(menuId, userId) {
        const menu = await this.prisma.menu.findFirst({
            where: { id: menuId, business: { userId } },
        });
        if (!menu)
            throw new common_1.NotFoundException('Menu not found');
        return this.prisma.qrCode.findMany({
            where: { menuId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async remove(id, userId) {
        const qr = await this.prisma.qrCode.findFirst({
            where: { id, menu: { business: { userId } } },
        });
        if (!qr)
            throw new common_1.NotFoundException('QR Code not found');
        if (qr.imageUrl) {
            const filepath = path.join(process.cwd(), qr.imageUrl);
            if (fs.existsSync(filepath))
                fs.unlinkSync(filepath);
        }
        await this.prisma.qrCode.delete({ where: { id } });
        return { message: 'QR Code deleted' };
    }
    async incrementScan(id) {
        return this.prisma.qrCode.update({
            where: { id },
            data: { scanCount: { increment: 1 } },
        });
    }
    async generatePreview(url) {
        return QRCode.toDataURL(url, { width: 400, margin: 2 });
    }
};
exports.QrCodeService = QrCodeService;
exports.QrCodeService = QrCodeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QrCodeService);
//# sourceMappingURL=qrcode.service.js.map