import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../../prisma/prisma.service'
import { GeminiService } from '../ai/gemini.service'
import { CatalogService } from '../catalog/catalog.service'
import type { CreateStackDto } from './dto/create-stack.dto'

const rateStore = new Map<string, number[]>()
const WINDOW_MS = 60 * 60 * 1000

@Injectable()
export class StacksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly catalog: CatalogService,
    private readonly gemini: GeminiService,
    private readonly config: ConfigService,
  ) {}

  private checkRateLimit(ip: string) {
    const max = Number(this.config.get('RATE_LIMIT_STACKS_PER_HOUR') ?? 10)
    const now = Date.now()
    const hits = (rateStore.get(ip) ?? []).filter((t) => t > now - WINDOW_MS)
    if (hits.length >= max) {
      throw new HttpException(
        'Too many stack generations. Try again later.',
        HttpStatus.TOO_MANY_REQUESTS,
      )
    }
    hits.push(now)
    rateStore.set(ip, hits)
  }

  private toResponse(row: {
    id: string
    idea: string
    selections: unknown
    title: string
    summary: string
    explanation: string
    diagram: string
    alternatives: unknown
    createdAt: Date
  }) {
    return {
      id: row.id,
      idea: row.idea,
      selections: row.selections as Record<string, string>,
      title: row.title,
      summary: row.summary,
      explanation: row.explanation,
      diagram: row.diagram,
      alternatives: row.alternatives ?? [],
      createdAt: row.createdAt.toISOString(),
    }
  }

  async create(dto: CreateStackDto, ip: string) {
    this.checkRateLimit(ip)

    const selections = dto.selections ?? {}
    const resolved = await this.catalog.resolveSelections(selections)

    let output
    try {
      output = await this.gemini.generateArchitecture({
        idea: dto.idea,
        resolvedStack: resolved,
      })
    } catch (err) {
      if (err instanceof HttpException) throw err
      throw new HttpException(
        'AI generation failed. Please try again.',
        HttpStatus.BAD_GATEWAY,
      )
    }

    const row = await this.prisma.stack.create({
      data: {
        idea: dto.idea,
        selections: selections as Prisma.InputJsonValue,
        title: output.title,
        summary: output.summary,
        explanation: output.explanation,
        diagram: output.diagram,
        alternatives: output.alternatives as Prisma.InputJsonValue,
      },
    })

    return this.toResponse(row)
  }

  async getOne(id: string) {
    const row = await this.prisma.stack.findUnique({ where: { id } })
    if (!row) throw new NotFoundException('Stack not found')
    return this.toResponse(row)
  }

  async list(page: number, limit: number) {
    const safePage = Math.max(1, page)
    const safeLimit = Math.min(50, Math.max(1, limit))
    const skip = (safePage - 1) * safeLimit

    const [items, total] = await Promise.all([
      this.prisma.stack.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: safeLimit,
        select: {
          id: true,
          idea: true,
          title: true,
          summary: true,
          createdAt: true,
          selections: true,
        },
      }),
      this.prisma.stack.count(),
    ])

    return {
      items: items.map((r) => ({
        id: r.id,
        idea: r.idea,
        title: r.title,
        summary: r.summary,
        selections: r.selections as Record<string, string>,
        createdAt: r.createdAt.toISOString(),
      })),
      page: safePage,
      limit: safeLimit,
      total,
    }
  }
}
