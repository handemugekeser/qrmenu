import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PLAN_LIMITS } from '../common/plan-limits.constants';
import * as QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import { IsOptional, IsString, IsInt } from 'class-validator';

export class CreateQrCodeDto {
  @IsOptional()
  @IsString()
  label?: string;

  @IsOptional()
  @IsInt()
  tableNumber?: number;
}

@Injectable()
export class QrCodeService {
  constructor(private prisma: PrismaService) {}

  async generate(menuId: string, userId: string, dto: CreateQrCodeDto) {
    const menu = await this.prisma.menu.findFirst({
      where: { id: menuId, business: { userId } },
      include: { business: { include: { user: { select: { plan: true } } } } },
    });
    if (!menu) throw new NotFoundException('Menu not found');

    if (dto.tableNumber) {
      const limits = PLAN_LIMITS[(menu.business as any).user.plan];
      if (!limits.tableQr) {
        throw new ForbiddenException(
          'Masa QR kodu özelliği Pro veya Premium plana özeldir. Yükseltme yaparak bu özelliği kullanabilirsiniz.',
        );
      }
    }

    const baseUrl = process.env.PUBLIC_URL || 'http://localhost:3000';
    const tableParam = dto.tableNumber ? `?table=${dto.tableNumber}` : '';
    const url = `${baseUrl}/menu/${menu.business.slug}${tableParam}`;

    // Generate QR code as data URL
    const qrDataUrl = await QRCode.toDataURL(url, {
      width: 400,
      margin: 2,
      color: {
        dark: '#1a1a2e',
        light: '#ffffff',
      },
    });

    // Save to uploads dir
    const uploadsDir = path.join(process.cwd(), 'uploads', 'qrcodes');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

    const filename = `qr-${uuidv4()}.png`;
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

  async findAll(menuId: string, userId: string) {
    const menu = await this.prisma.menu.findFirst({
      where: { id: menuId, business: { userId } },
    });
    if (!menu) throw new NotFoundException('Menu not found');

    return this.prisma.qrCode.findMany({
      where: { menuId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async remove(id: string, userId: string) {
    const qr = await this.prisma.qrCode.findFirst({
      where: { id, menu: { business: { userId } } },
    });
    if (!qr) throw new NotFoundException('QR Code not found');

    // Remove file if exists
    if (qr.imageUrl) {
      const filepath = path.join(process.cwd(), qr.imageUrl);
      if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
    }

    await this.prisma.qrCode.delete({ where: { id } });
    return { message: 'QR Code deleted' };
  }

  async incrementScan(id: string) {
    return this.prisma.qrCode.update({
      where: { id },
      data: { scanCount: { increment: 1 } },
    });
  }

  // Generate QR as base64 on the fly (no DB save)
  async generatePreview(url: string): Promise<string> {
    return QRCode.toDataURL(url, { width: 400, margin: 2 });
  }
}
