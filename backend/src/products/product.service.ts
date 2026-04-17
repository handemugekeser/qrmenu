import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PLAN_LIMITS } from '../common/plan-limits.constants';
import { IsString, IsNumber, IsBoolean, IsOptional, IsUrl, IsArray } from 'class-validator';

export class CreateProductDto {
  @IsString() name: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() imageUrl?: string;
  @IsNumber() basePrice: number;
  @IsOptional() @IsNumber() calories?: number;
  @IsOptional() @IsArray() allergens?: string[];
  @IsOptional() @IsBoolean() isAvailable?: boolean;
  @IsOptional() @IsBoolean() isPopular?: boolean;
  @IsOptional() @IsArray() variants?: { name: string; price: number; isDefault?: boolean }[];
  @IsOptional() @IsArray() extras?: { name: string; price: number; isRequired?: boolean; maxSelect?: number }[];
}

export class UpdateProductDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() imageUrl?: string;
  @IsOptional() @IsNumber() basePrice?: number;
  @IsOptional() @IsNumber() calories?: number;
  @IsOptional() @IsArray() allergens?: string[];
  @IsOptional() @IsBoolean() isAvailable?: boolean;
  @IsOptional() @IsBoolean() isPopular?: boolean;
}

export class CreateVariantDto {
  name: string;
  price: number;
  isDefault?: boolean;
}

export class CreateExtraDto {
  name: string;
  price: number;
  isRequired?: boolean;
  maxSelect?: number;
}

export class ReorderProductsDto {
  @IsArray()
  @IsString({ each: true })
  ids: string[];
}

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(categoryId: string, userId: string, dto: CreateProductDto) {
    await this.checkCategoryOwnership(categoryId, userId);

    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { plan: true } });
    const limits = PLAN_LIMITS[user.plan];
    if (limits.maxProducts !== -1) {
      const totalProducts = await this.prisma.product.count({
        where: { category: { menu: { business: { userId } } } },
      });
      if (totalProducts >= limits.maxProducts) {
        throw new ForbiddenException(
          `Plan limitine ulaştınız. ${user.plan === 'FREE' ? 'Pro' : 'Premium'} aboneliğe geçerek daha fazla ürün ekleyebilirsiniz.`,
        );
      }
    }

    const count = await this.prisma.product.count({ where: { categoryId } });
    const { variants, extras, ...productData } = dto;

    return this.prisma.product.create({
      data: {
        ...productData,
        categoryId,
        sortOrder: count,
        variants: variants ? { create: variants.map((v, i) => ({ ...v, sortOrder: i })) } : undefined,
        extras: extras ? { create: extras.map((e, i) => ({ ...e, sortOrder: i })) } : undefined,
      },
      include: { variants: true, extras: true },
    });
  }

  async findAll(categoryId: string, userId: string) {
    await this.checkCategoryOwnership(categoryId, userId);
    return this.prisma.product.findMany({
      where: { categoryId },
      include: { variants: { orderBy: { sortOrder: 'asc' } }, extras: { orderBy: { sortOrder: 'asc' } }, translations: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findOne(id: string, userId: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, category: { menu: { business: { userId } } } },
      include: { variants: true, extras: true, translations: true },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: string, userId: string, dto: UpdateProductDto) {
    await this.checkProductOwnership(id, userId);
    return this.prisma.product.update({
      where: { id },
      data: dto,
      include: { variants: true, extras: true },
    });
  }

  async remove(id: string, userId: string) {
    await this.checkProductOwnership(id, userId);
    await this.prisma.product.delete({ where: { id } });
    return { message: 'Product deleted' };
  }

  async reorder(categoryId: string, userId: string, dto: ReorderProductsDto) {
    await this.checkCategoryOwnership(categoryId, userId);
    const updates = dto.ids.map((id, index) =>
      this.prisma.product.update({ where: { id }, data: { sortOrder: index } }),
    );
    await this.prisma.$transaction(updates);
    return { message: 'Reordered successfully' };
  }

  // Variants
  async addVariant(productId: string, userId: string, dto: CreateVariantDto) {
    await this.checkProductOwnership(productId, userId);
    if (dto.isDefault) {
      await this.prisma.variant.updateMany({ where: { productId }, data: { isDefault: false } });
    }
    return this.prisma.variant.create({ data: { ...dto, productId } });
  }

  async updateVariant(variantId: string, userId: string, data: Partial<CreateVariantDto>) {
    const variant = await this.prisma.variant.findFirst({
      where: { id: variantId, product: { category: { menu: { business: { userId } } } } },
    });
    if (!variant) throw new NotFoundException('Variant not found');
    return this.prisma.variant.update({ where: { id: variantId }, data });
  }

  async removeVariant(variantId: string, userId: string) {
    const variant = await this.prisma.variant.findFirst({
      where: { id: variantId, product: { category: { menu: { business: { userId } } } } },
    });
    if (!variant) throw new NotFoundException('Variant not found');
    await this.prisma.variant.delete({ where: { id: variantId } });
    return { message: 'Variant deleted' };
  }

  // Extras
  async addExtra(productId: string, userId: string, dto: CreateExtraDto) {
    await this.checkProductOwnership(productId, userId);
    return this.prisma.extra.create({ data: { ...dto, productId } });
  }

  async updateExtra(extraId: string, userId: string, data: Partial<CreateExtraDto>) {
    const extra = await this.prisma.extra.findFirst({
      where: { id: extraId, product: { category: { menu: { business: { userId } } } } },
    });
    if (!extra) throw new NotFoundException('Extra not found');
    return this.prisma.extra.update({ where: { id: extraId }, data });
  }

  async removeExtra(extraId: string, userId: string) {
    const extra = await this.prisma.extra.findFirst({
      where: { id: extraId, product: { category: { menu: { business: { userId } } } } },
    });
    if (!extra) throw new NotFoundException('Extra not found');
    await this.prisma.extra.delete({ where: { id: extraId } });
    return { message: 'Extra deleted' };
  }

  private async checkCategoryOwnership(categoryId: string, userId: string) {
    const cat = await this.prisma.category.findFirst({
      where: { id: categoryId, menu: { business: { userId } } },
    });
    if (!cat) throw new NotFoundException('Category not found');
    return cat;
  }

  private async checkProductOwnership(productId: string, userId: string) {
    const product = await this.prisma.product.findFirst({
      where: { id: productId, category: { menu: { business: { userId } } } },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }
}
