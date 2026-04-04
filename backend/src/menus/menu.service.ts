import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { PLAN_LIMITS } from '../common/plan-limits.constants';

export class CreateMenuDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  themeColor?: string;
}

export class UpdateMenuDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @IsOptional()
  @IsString()
  themeColor?: string;
}

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  async create(businessId: string, userId: string, dto: CreateMenuDto) {
    await this.checkBusinessOwnership(businessId, userId);

    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { plan: true } });
    const limits = PLAN_LIMITS[user.plan];
    if (limits.maxMenus !== -1) {
      const count = await this.prisma.menu.count({ where: { business: { userId } } });
      if (count >= limits.maxMenus) {
        throw new ForbiddenException(
          `Plan limitine ulaştınız. ${user.plan === 'FREE' ? 'Pro' : 'Premium'} aboneliğe geçerek daha fazla menü ekleyebilirsiniz.`,
        );
      }
    }

    return this.prisma.menu.create({
      data: { ...dto, businessId },
    });
  }

  async findAll(businessId: string, userId: string) {
    await this.checkBusinessOwnership(businessId, userId);
    return this.prisma.menu.findMany({
      where: { businessId },
      include: {
        _count: { select: { categories: true, qrCodes: true, analytics: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const menu = await this.prisma.menu.findFirst({
      where: { id, business: { userId } },
      include: {
        categories: {
          include: {
            products: {
              include: { variants: true, extras: true },
              orderBy: { sortOrder: 'asc' },
            },
          },
          orderBy: { sortOrder: 'asc' },
        },
        _count: { select: { qrCodes: true, analytics: true } },
      },
    });
    if (!menu) throw new NotFoundException('Menu not found');
    return menu;
  }

  async update(id: string, userId: string, dto: UpdateMenuDto) {
    await this.checkMenuOwnership(id, userId);
    
    // If setting as default, unset others
    if (dto.isDefault) {
      const menu = await this.prisma.menu.findUnique({ where: { id } });
      await this.prisma.menu.updateMany({
        where: { businessId: menu.businessId, isDefault: true },
        data: { isDefault: false },
      });
    }

    return this.prisma.menu.update({ where: { id }, data: dto });
  }

  async remove(id: string, userId: string) {
    await this.checkMenuOwnership(id, userId);
    await this.prisma.menu.delete({ where: { id } });
    return { message: 'Menu deleted' };
  }

  private async checkBusinessOwnership(businessId: string, userId: string) {
    const business = await this.prisma.business.findFirst({ where: { id: businessId, userId } });
    if (!business) throw new NotFoundException('Business not found');
    return business;
  }

  private async checkMenuOwnership(id: string, userId: string) {
    const menu = await this.prisma.menu.findFirst({ where: { id, business: { userId } } });
    if (!menu) throw new NotFoundException('Menu not found');
    return menu;
  }
}
