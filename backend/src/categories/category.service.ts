import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IsOptional, IsString, IsBoolean, IsArray } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class ReorderDto {
  @IsArray()
  @IsString({ each: true })
  ids: string[];
}

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(menuId: string, userId: string, dto: CreateCategoryDto) {
    await this.checkMenuOwnership(menuId, userId);
    const count = await this.prisma.category.count({ where: { menuId } });
    return this.prisma.category.create({
      data: { ...dto, menuId, sortOrder: count },
    });
  }

  async findAll(menuId: string, userId: string) {
    await this.checkMenuOwnership(menuId, userId);
    return this.prisma.category.findMany({
      where: { menuId },
      include: {
        _count: { select: { products: true } },
        translations: true,
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async update(id: string, userId: string, dto: UpdateCategoryDto) {
    await this.checkCategoryOwnership(id, userId);
    return this.prisma.category.update({ where: { id }, data: dto });
  }

  async remove(id: string, userId: string) {
    await this.checkCategoryOwnership(id, userId);
    await this.prisma.category.delete({ where: { id } });
    return { message: 'Category deleted' };
  }

  async reorder(menuId: string, userId: string, dto: ReorderDto) {
    await this.checkMenuOwnership(menuId, userId);
    const updates = dto.ids.map((id, index) =>
      this.prisma.category.update({ where: { id }, data: { sortOrder: index } }),
    );
    await this.prisma.$transaction(updates);
    return { message: 'Reordered successfully' };
  }

  private async checkMenuOwnership(menuId: string, userId: string) {
    const menu = await this.prisma.menu.findFirst({ where: { id: menuId, business: { userId } } });
    if (!menu) throw new NotFoundException('Menu not found');
    return menu;
  }

  private async checkCategoryOwnership(id: string, userId: string) {
    const cat = await this.prisma.category.findFirst({
      where: { id, menu: { business: { userId } } },
    });
    if (!cat) throw new NotFoundException('Category not found');
    return cat;
  }
}
