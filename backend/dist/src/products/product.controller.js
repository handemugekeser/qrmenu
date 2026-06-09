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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const common_1 = require("@nestjs/common");
const product_service_1 = require("./product.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let ProductController = class ProductController {
    constructor(productService) {
        this.productService = productService;
    }
    create(categoryId, userId, dto) {
        return this.productService.create(categoryId, userId, dto);
    }
    findAll(categoryId, userId) {
        return this.productService.findAll(categoryId, userId);
    }
    reorder(catId, userId, dto) {
        return this.productService.reorder(catId, userId, dto);
    }
    findOne(id, userId) {
        return this.productService.findOne(id, userId);
    }
    update(id, userId, dto) {
        return this.productService.update(id, userId, dto);
    }
    remove(id, userId) {
        return this.productService.remove(id, userId);
    }
    addVariant(id, userId, dto) {
        return this.productService.addVariant(id, userId, dto);
    }
    updateVariant(vid, userId, dto) {
        return this.productService.updateVariant(vid, userId, dto);
    }
    removeVariant(vid, userId) {
        return this.productService.removeVariant(vid, userId);
    }
    addExtra(id, userId, dto) {
        return this.productService.addExtra(id, userId, dto);
    }
    updateExtra(eid, userId, dto) {
        return this.productService.updateExtra(eid, userId, dto);
    }
    removeExtra(eid, userId) {
        return this.productService.removeExtra(eid, userId);
    }
};
exports.ProductController = ProductController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Param)('categoryId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, product_service_1.CreateProductDto]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('categoryId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)('reorder'),
    __param(0, (0, common_1.Param)('categoryId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, product_service_1.ReorderProductsDto]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "reorder", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, product_service_1.UpdateProductDto]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/variants'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, product_service_1.CreateVariantDto]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "addVariant", null);
__decorate([
    (0, common_1.Patch)(':id/variants/:variantId'),
    __param(0, (0, common_1.Param)('variantId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "updateVariant", null);
__decorate([
    (0, common_1.Delete)(':id/variants/:variantId'),
    __param(0, (0, common_1.Param)('variantId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "removeVariant", null);
__decorate([
    (0, common_1.Post)(':id/extras'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, product_service_1.CreateExtraDto]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "addExtra", null);
__decorate([
    (0, common_1.Patch)(':id/extras/:extraId'),
    __param(0, (0, common_1.Param)('extraId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "updateExtra", null);
__decorate([
    (0, common_1.Delete)(':id/extras/:extraId'),
    __param(0, (0, common_1.Param)('extraId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "removeExtra", null);
exports.ProductController = ProductController = __decorate([
    (0, common_1.Controller)('categories/:categoryId/products'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [product_service_1.ProductService])
], ProductController);
//# sourceMappingURL=product.controller.js.map