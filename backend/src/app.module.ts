import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AiModule } from './modules/ai/ai.module'
import { CatalogModule } from './modules/catalog/catalog.module'
import { FaviconModule } from './modules/favicon/favicon.module'
import { HealthModule } from './modules/health/health.module'
import { StacksModule } from './modules/stacks/stacks.module'
import { PrismaModule } from './prisma/prisma.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    HealthModule,
    CatalogModule,
    FaviconModule,
    StacksModule,
    AiModule,
  ],
})
export class AppModule {}
