import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_FILTER } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { BusinessModule } from './businesses/business.module';
import { MenuModule } from './menus/menu.module';
import { CategoryModule } from './categories/category.module';
import { ProductModule } from './products/product.module';
import { TranslationModule } from './translations/translation.module';
import { QrCodeModule } from './qrcodes/qrcode.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { PublicModule } from './public/public.module';
import { SubscriptionModule } from './subscriptions/subscription.module';
import { UploadModule } from './upload/upload.module';
import { InsightsModule } from './modules/insights/insights.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AdminModule } from './modules/admin/admin.module';

import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { Reflector } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 60 }]),
    PrismaModule,
    AuthModule,
    BusinessModule,
    MenuModule,
    CategoryModule,
    ProductModule,
    TranslationModule,
    QrCodeModule,
    AnalyticsModule,
    PublicModule,
    SubscriptionModule,
    UploadModule,
    InsightsModule,
    NotificationsModule,
    AdminModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
