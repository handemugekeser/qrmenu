import { IsOptional, IsString, IsInt, Min, Max, IsEnum, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { SubscriptionPlan, UserRole } from '@prisma/client';

export class ListUsersDto {
  @IsOptional() @IsString()
  search?: string;

  @IsOptional() @IsEnum(SubscriptionPlan)
  plan?: SubscriptionPlan;

  @IsOptional() @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  page?: number = 1;

  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100)
  limit?: number = 20;
}

export class ListBusinessesDto {
  @IsOptional() @IsString()
  search?: string;

  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  page?: number = 1;

  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100)
  limit?: number = 20;
}

export class ListMenusDto {
  @IsOptional() @IsString()
  search?: string;

  @IsOptional() @Type(() => Boolean)
  active?: boolean;

  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  page?: number = 1;

  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100)
  limit?: number = 20;
}

export class UpdateUserDto {
  @IsOptional() @IsEnum(SubscriptionPlan)
  plan?: SubscriptionPlan;

  @IsOptional() @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional() @IsBoolean()
  isActive?: boolean;
}
