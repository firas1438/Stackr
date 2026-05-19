import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  async getCatalog() {
    const categories = await this.prisma.category.findMany({
      where: { active: true },
      orderBy: { sort: 'asc' },
      include: {
        technologies: {
          where: { active: true },
          orderBy: { sort: 'asc' },
        },
      },
    })

    return {
      categories: categories.map((c) => ({
        id: c.slug,
        name: c.name,
        subtitle: c.subtitle,
        items: c.technologies.map((t) => ({
          id: t.slug,
          name: t.name,
          domain: t.domain ?? undefined,
        })),
      })),
    }
  }

  async resolveSelections(selections: Record<string, string>) {
    const slugs = Object.values(selections)
    const techs = await this.prisma.technology.findMany({
      where: { slug: { in: slugs }, active: true },
      include: { category: true },
    })
    const bySlug = new Map(techs.map((t) => [t.slug, t]))

    const resolved: { category: string; technology: string }[] = []
    for (const [categorySlug, techSlug] of Object.entries(selections)) {
      const tech = bySlug.get(techSlug)
      if (!tech || tech.category.slug !== categorySlug) continue
      resolved.push({
        category: tech.category.name,
        technology: tech.name,
      })
    }
    return resolved
  }
}
