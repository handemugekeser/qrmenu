import { IsEnum, IsObject, IsOptional, IsString, MaxLength } from 'class-validator';
import { AnalyticsEventType } from '@prisma/client';

export class TrackEventDto {
  @IsString()
  @MaxLength(64)
  businessId!: string;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  menuId?: string;

  @IsEnum(AnalyticsEventType)
  type!: AnalyticsEventType;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  itemId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  categoryId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(8)
  language?: string;

  @IsString()
  @MaxLength(128)
  sessionId!: string;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  tableNumber?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
