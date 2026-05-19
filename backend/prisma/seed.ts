import { PrismaClient } from '@prisma/client'
import { CATALOG_LAYERS } from './catalog-data'

const prisma = new PrismaClient()

async function main() {
  await prisma.technology.deleteMany()
  await prisma.category.deleteMany()

  for (let i = 0; i < CATALOG_LAYERS.length; i++) {
    const layer = CATALOG_LAYERS[i]
    const category = await prisma.category.create({
      data: {
        slug: layer.slug,
        name: layer.name,
        subtitle: layer.subtitle,
        sort: i,
        technologies: {
          create: layer.items.map((item, j) => ({
            slug: item.slug,
            name: item.name,
            domain: item.domain ?? null,
            sort: j,
          })),
        },
      },
    })
    console.log(`Seeded category: ${category.name}`)
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e)
    prisma.$disconnect()
    process.exit(1)
  })
