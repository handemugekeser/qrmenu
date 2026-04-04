import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { Language } from '@prisma/client';
import { Request } from 'express';

@Injectable()
export class PublicMenuService {
  constructor(
    private prisma: PrismaService,
    private analytics: AnalyticsService,
  ) {}

  async getBySlug(slug: string, lang: Language, req: Request, tableNumber?: number, menuId?: string) {
    const menuFilter = menuId
      ? { id: menuId }
      : { isActive: true };

    const business = await this.prisma.business.findUnique({
      where: { slug, isActive: true },
      include: {
        menus: {
          where: menuFilter,
          take: 1,
          orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
          include: {
            categories: {
              where: { isActive: true },
              orderBy: { sortOrder: 'asc' },
              include: {
                translations: { where: { language: lang } },
                products: {
                  where: { isAvailable: true },
                  orderBy: { sortOrder: 'asc' },
                  include: {
                    variants: { orderBy: { sortOrder: 'asc' } },
                    extras: { orderBy: { sortOrder: 'asc' } },
                    translations: { where: { language: lang } },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!business || business.menus.length === 0) {
      throw new NotFoundException('Menu not found');
    }

    const menu = business.menus[0];

    // Track view
    await this.analytics.track(menu.id, req, tableNumber).catch(() => {});

    // Apply translations to names/descriptions
    const translatedMenu = this.applyTranslations(menu, lang);

    return {
      business: {
        name: business.name,
        description: business.description,
        logoUrl: business.logoUrl,
        coverUrl: business.coverUrl,
        currency: business.currency,
        phone: business.phone,
      },
      menu: translatedMenu,
    };
  }

  private applyTranslations(menu: any, lang: Language) {
    return {
      ...menu,
      categories: menu.categories.map((cat: any) => {
        const catNameT = cat.translations.find((t: any) => t.field === 'name');
        const catDescT = cat.translations.find((t: any) => t.field === 'description');
        return {
          ...cat,
          name: catNameT?.value || cat.name,
          description: catDescT?.value || cat.description,
          products: cat.products.map((prod: any) => {
            const prodNameT = prod.translations.find((t: any) => t.field === 'name');
            const prodDescT = prod.translations.find((t: any) => t.field === 'description');
            return {
              ...prod,
              name: prodNameT?.value || prod.name,
              description: prodDescT?.value || prod.description,
            };
          }),
        };
      }),
    };
  }
}
