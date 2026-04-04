import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { QrCodeService, CreateQrCodeDto } from './qrcode.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';

@Controller('menus/:menuId/qrcodes')
@UseGuards(JwtAuthGuard)
export class QrCodeController {
  constructor(private qrCodeService: QrCodeService) {}

  @Post()
  generate(
    @Param('menuId') menuId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: CreateQrCodeDto,
  ) {
    return this.qrCodeService.generate(menuId, userId, dto);
  }

  @Get()
  findAll(@Param('menuId') menuId: string, @CurrentUser('id') userId: string) {
    return this.qrCodeService.findAll(menuId, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.qrCodeService.remove(id, userId);
  }
}
