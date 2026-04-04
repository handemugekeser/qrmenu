import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { MenuService, CreateMenuDto, UpdateMenuDto } from './menu.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('businesses/:businessId/menus')
@UseGuards(JwtAuthGuard)
export class MenuController {
  constructor(private menuService: MenuService) {}

  @Post()
  create(
    @Param('businessId') businessId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: CreateMenuDto,
  ) {
    return this.menuService.create(businessId, userId, dto);
  }

  @Get()
  findAll(@Param('businessId') businessId: string, @CurrentUser('id') userId: string) {
    return this.menuService.findAll(businessId, userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.menuService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateMenuDto,
  ) {
    return this.menuService.update(id, userId, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.menuService.remove(id, userId);
  }
}
