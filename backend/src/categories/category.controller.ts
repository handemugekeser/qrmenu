import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CategoryService, CreateCategoryDto, UpdateCategoryDto, ReorderDto } from './category.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('menus/:menuId/categories')
@UseGuards(JwtAuthGuard)
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post()
  create(
    @Param('menuId') menuId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: CreateCategoryDto,
  ) {
    return this.categoryService.create(menuId, userId, dto);
  }

  @Get()
  findAll(@Param('menuId') menuId: string, @CurrentUser('id') userId: string) {
    return this.categoryService.findAll(menuId, userId);
  }

  @Post('reorder')
  reorder(
    @Param('menuId') menuId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: ReorderDto,
  ) {
    return this.categoryService.reorder(menuId, userId, dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, userId, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.categoryService.remove(id, userId);
  }
}
