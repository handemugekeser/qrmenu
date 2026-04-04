import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { TranslationService, UpsertTranslationDto } from './translation.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('translations')
@UseGuards(JwtAuthGuard)
export class TranslationController {
  constructor(private translationService: TranslationService) {}

  @Post()
  upsert(@CurrentUser('id') userId: string, @Body() dto: UpsertTranslationDto) {
    return this.translationService.upsert(userId, dto);
  }

  @Get(':entityType/:entityId')
  findForEntity(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.translationService.findForEntity(entityType, entityId, userId);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.translationService.deleteTranslation(id, userId);
  }
}
