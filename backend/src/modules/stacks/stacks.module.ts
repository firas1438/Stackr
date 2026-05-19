import { Module } from '@nestjs/common'
import { AiModule } from '../ai/ai.module'
import { CatalogModule } from '../catalog/catalog.module'
import { StacksController } from './stacks.controller'
import { StacksService } from './stacks.service'

@Module({
  imports: [CatalogModule, AiModule],
  controllers: [StacksController],
  providers: [StacksService],
})
export class StacksModule {}
