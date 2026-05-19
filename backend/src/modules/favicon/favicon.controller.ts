import { Controller, Get, Query, Res, BadRequestException, NotFoundException } from '@nestjs/common'
import type { Response } from 'express'

const MAX_DOMAIN_LENGTH = 253

function isValidDomain(d: string | undefined): d is string {
  if (!d || d.length > MAX_DOMAIN_LENGTH) return false
  if (!/^[a-z0-9.-]+$/i.test(d)) return false
  if (d.startsWith('.') || d.endsWith('.')) return false
  if (d.startsWith('-') || d.endsWith('-')) return false
  if (!d.includes('.')) return false
  if (/^\d+\.\d+\.\d+\.\d+$/.test(d)) return false
  return true
}

@Controller('favicon')
export class FaviconController {
  @Get()
  async proxy(@Query('domain') domain: string | undefined, @Res() res: Response) {
    if (!isValidDomain(domain)) {
      throw new BadRequestException('bad domain')
    }

    let upstream: globalThis.Response
    try {
      upstream = await fetch(
        `https://icons.duckduckgo.com/ip3/${encodeURIComponent(domain)}.ico`,
        { signal: AbortSignal.timeout(5000) },
      )
    } catch {
      throw new NotFoundException('upstream unavailable')
    }

    if (!upstream.ok) {
      throw new NotFoundException('not found')
    }

    const buffer = Buffer.from(await upstream.arrayBuffer())
    res.set({
      'Content-Type': upstream.headers.get('Content-Type') ?? 'image/png',
      'Cache-Control': 'public, max-age=2592000, immutable',
    })
    res.send(buffer)
  }
}
