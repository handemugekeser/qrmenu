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
exports.QrCodeController = void 0;
const common_1 = require("@nestjs/common");
const qrcode_service_1 = require("./qrcode.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let QrCodeController = class QrCodeController {
    constructor(qrCodeService) {
        this.qrCodeService = qrCodeService;
    }
    generate(menuId, userId, dto) {
        return this.qrCodeService.generate(menuId, userId, dto);
    }
    findAll(menuId, userId) {
        return this.qrCodeService.findAll(menuId, userId);
    }
    remove(id, userId) {
        return this.qrCodeService.remove(id, userId);
    }
};
exports.QrCodeController = QrCodeController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Param)('menuId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, qrcode_service_1.CreateQrCodeDto]),
    __metadata("design:returntype", void 0)
], QrCodeController.prototype, "generate", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('menuId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], QrCodeController.prototype, "findAll", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], QrCodeController.prototype, "remove", null);
exports.QrCodeController = QrCodeController = __decorate([
    (0, common_1.Controller)('menus/:menuId/qrcodes'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [qrcode_service_1.QrCodeService])
], QrCodeController);
//# sourceMappingURL=qrcode.controller.js.map