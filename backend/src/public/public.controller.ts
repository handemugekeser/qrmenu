import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { PublicMenuService } from './public.service';
import { Public } from '../common/decorators/public.decorator';
import { Language } from '@prisma/client';
import { Request } from 'express';

@Controller('public')
export class PublicController {
  constructor(private publicMenuService: PublicMenuService) {}

  @Public()
  @Get('menu/:slug')
  getMenu(
    @Param('slug') slug: string,
    @Query('lang') lang: string,
    @Query('table') table: string,
    @Query('menuId') menuId: string,
    @Req() req: Request,
  ) {
    const language = (lang?.toUpperCase() as Language) || Language.TR;
    const tableNumber = table ? parseInt(table) : undefined;
    return this.publicMenuService.getBySlug(slug, language, req, tableNumber, menuId);
  }
}
