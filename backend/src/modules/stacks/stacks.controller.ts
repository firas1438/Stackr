import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common'
import type { Request } from 'express'
import { CreateStackDto } from './dto/create-stack.dto'
import { StacksService } from './stacks.service'

@Controller('stacks')
export class StacksController {
  constructor(private readonly stacks: StacksService) {}

  @Post()
  create(@Body() dto: CreateStackDto, @Req() req: Request) {
    const ip = req.ip ?? 'unknown'
    return this.stacks.create(dto, ip)
  }

  @Get()
  list(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.stacks.list(
      page ? Number(page) : 1,
      limit ? Number(limit) : 20,
    )
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.stacks.getOne(id)
  }
}
