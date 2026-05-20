import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageContainer } from '@/components/page-container'
import { ItemLogo } from '@/components/item-logo'
import { listStacks, getCatalog, CatalogItem } from '@/lib/api'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, } from '@/components/ui/pagination'
import { History } from 'lucide-react'

export function HistoryPage() {
  // pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const limit = 5

  // fetch data from API
  const { data, isLoading, isError } = useQuery({ queryKey: ['stacks', 'history', currentPage], queryFn: () => listStacks(currentPage, limit), })
  const { data: catalogData } = useQuery({ queryKey: ['catalog'], queryFn: getCatalog, })

  // pagination logic
  const totalPages = data ? Math.ceil(data.total / limit) : 0
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = []
    const maxVisible = 5
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, 'ellipsis', totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, 'ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages)
      }
    }
    return pages
  }

  // create a flat map of all technologies for quick logo details retrieval
  const techLookup = useMemo(() => {
    const map = new Map<string, CatalogItem>()
    if (catalogData?.categories) {
      for (const cat of catalogData.categories) {
        for (const item of cat.items) {
          map.set(item.id, item)
        }
      }
    }
    return map
  }, [catalogData])

  return (
    <PageContainer>

      {/* header */}
      <header className="mb-8">
        <div className="flex items-center gap-2.5">
          <History size={22} className="text-primary" />
          <h1 className="text-2xl font-semibold tracking-tight text-primary">Browse history</h1>
        </div>
        <p className="mt-1.5 text-sm text-muted-foreground">Recent architectures that were anonymously generated on Stackr</p>
      </header>

      {/* loading state */}
      {isLoading && (
        <div className="flex items-center gap-2 text-muted-foreground py-12 justify-center">
          <Loader2 className="animate-spin" size={20} />
          Loading…
        </div>
      )}

      {/* error state */}
      {isError && <p className="text-center text-red-400 py-12">Could not load history.</p>}

      {/* no stack found */}
      {data && data.items.length === 0 && (
        <p className="text-center text-muted-foreground py-12">
          No stacks yet.{' '}
          <Link to="/build" className="text-primary hover:underline">
            Build your first
          </Link>
        </p>
      )}

      {/* tech stack */}
      <div className="rounded-xl border border-[var(--border)] overflow-hidden divide-y divide-[var(--border)]">
        {data?.items.map((item) => {
          {/* retrieve tech stack */ }
          const selectedTechs = Object.values(item.selections || {}).map((id) => techLookup.get(id)).filter((t): t is CatalogItem => !!t)
          return (
            <Link key={item.id} to={`/stack/${item.id}`} className="group block">
              <div className="p-6 bg-muted/30 hover:bg-[var(--muted)] transition-colors duration-150">
                {/* title row */}
                <div className="flex text-sm sm:text-md items-baseline justify-between gap-3 mb-2">
                  <h3 className=" font-semibold text-foreground line-clamp-2 flex-1">
                    {item.title}
                  </h3>
                  <time className="text-xs tabular-nums text-muted-foreground/50 shrink-0">
                    {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </time>
                </div>

                {/* summary */}
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {item.summary}
                </p>

                {/* tech stack */}
                {selectedTechs.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {selectedTechs.map((tech) => (
                      <div
                        key={tech.id}
                        className="inline-flex items-center gap-1 bg-[var(--background)] border border-[var(--border)] rounded-full px-2 py-0.5"
                        title={tech.name}
                      >
                        <ItemLogo name={tech.name} domain={tech.domain} itemId={tech.id} size={13} />
                        <span className="text-[10px] font-medium text-muted-foreground">{tech.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          )
        })}
      </div>

      {/* pagination */}
      {data && totalPages > 1 && (
        <Pagination className="mt-12">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>

            {getPageNumbers().map((pageVal, idx) => (
              <PaginationItem key={idx}>
                {pageVal === 'ellipsis' ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    isActive={currentPage === pageVal}
                    onClick={() => handlePageChange(pageVal)}
                    className="cursor-pointer"
                  >
                    {pageVal}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </PageContainer>
  )
}

