"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicMenuService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const analytics_service_1 = require("../analytics/analytics.service");
let PublicMenuService = class PublicMenuService {
    constructor(prisma, analytics) {
        this.prisma = prisma;
        this.analytics = analytics;
    }
    async getBySlug(slug, lang, req, tableNumber, menuId) {
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
            throw new common_1.NotFoundException('Menu not found');
        }
        const menu = business.menus[0];
        await this.analytics.track(menu.id, req, tableNumber).catch(() => { });
        const translatedMenu = this.applyTranslations(menu, lang);
        return {
            business: {
                name: business.name,
                description: business.description,
                logoUrl: business.logoUrl,
                coverUrl: business.coverUrl,
                currency: business.currency,
                phone: business.phone,
                socialLinks: business.socialLinks,
            },
            menu: translatedMenu,
        };
    }
    applyTranslations(menu, lang) {
        return {
            ...menu,
            categories: menu.categories.map((cat) => {
                const catNameT = cat.translations.find((t) => t.field === 'name');
                const catDescT = cat.translations.find((t) => t.field === 'description');
                return {
                    ...cat,
                    name: catNameT?.value || cat.name,
                    description: catDescT?.value || cat.description,
                    products: cat.products.map((prod) => {
                        const prodNameT = prod.translations.find((t) => t.field === 'name');
                        const prodDescT = prod.translations.find((t) => t.field === 'description');
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
};
exports.PublicMenuService = PublicMenuService;
exports.PublicMenuService = PublicMenuService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        analytics_service_1.AnalyticsService])
], PublicMenuService);
//# sourceMappingURL=public.service.js.map