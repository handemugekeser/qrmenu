import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ProductService, CreateProductDto, UpdateProductDto, CreateVariantDto, CreateExtraDto, ReorderProductsDto } from './product.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('categories/:categoryId/products')
@UseGuards(JwtAuthGuard)
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  create(@Param('categoryId') categoryId: string, @CurrentUser('id') userId: string, @Body() dto: CreateProductDto) {
    return this.productService.create(categoryId, userId, dto);
  }

  @Get()
  findAll(@Param('categoryId') categoryId: string, @CurrentUser('id') userId: string) {
    return this.productService.findAll(categoryId, userId);
  }

  @Post('reorder')
  reorder(@Param('categoryId') catId: string, @CurrentUser('id') userId: string, @Body() dto: ReorderProductsDto) {
    return this.productService.reorder(catId, userId, dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.productService.findOne(id, userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @CurrentUser('id') userId: string, @Body() dto: UpdateProductDto) {
    return this.productService.update(id, userId, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.productService.remove(id, userId);
  }

  // Variants
  @Post(':id/variants')
  addVariant(@Param('id') id: string, @CurrentUser('id') userId: string, @Body() dto: CreateVariantDto) {
    return this.productService.addVariant(id, userId, dto);
  }

  @Patch(':id/variants/:variantId')
  updateVariant(@Param('variantId') vid: string, @CurrentUser('id') userId: string, @Body() dto: Partial<CreateVariantDto>) {
    return this.productService.updateVariant(vid, userId, dto);
  }

  @Delete(':id/variants/:variantId')
  removeVariant(@Param('variantId') vid: string, @CurrentUser('id') userId: string) {
    return this.productService.removeVariant(vid, userId);
  }

  // Extras
  @Post(':id/extras')
  addExtra(@Param('id') id: string, @CurrentUser('id') userId: string, @Body() dto: CreateExtraDto) {
    return this.productService.addExtra(id, userId, dto);
  }

  @Patch(':id/extras/:extraId')
  updateExtra(@Param('extraId') eid: string, @CurrentUser('id') userId: string, @Body() dto: Partial<CreateExtraDto>) {
    return this.productService.updateExtra(eid, userId, dto);
  }

  @Delete(':id/extras/:extraId')
  removeExtra(@Param('extraId') eid: string, @CurrentUser('id') userId: string) {
    return this.productService.removeExtra(eid, userId);
  }
}
