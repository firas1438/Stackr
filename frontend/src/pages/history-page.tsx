import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageContainer } from '@/components/page-container'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { listStacks } from '@/lib/api'

export function HistoryPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['stacks', 'history'],
    queryFn: () => listStacks(1, 30),
  })

  return (
    <PageContainer>
      <header className="mb-12 border-l-4 border-primary pl-4 rounded-md">
        <h1 className="text-3xl font-bold tracking-tight">History</h1>
        <p className="mt-2 text-muted-foreground">Recent architectures generated on Stackr</p>
      </header>

      {isLoading && (
        <div className="flex items-center gap-2 text-muted-foreground py-12 justify-center">
          <Loader2 className="animate-spin" size={20} />
          Loading…
        </div>
      )}

      {isError && <p className="text-center text-red-400 py-12">Could not load history.</p>}

      {data && data.items.length === 0 && (
        <p className="text-center text-muted-foreground py-12">
          No stacks yet.{' '}
          <Link to="/build" className="text-primary hover:underline">
            Build your first
          </Link>
        </p>
      )}

      <div className="space-y-4">
        {data?.items.map((item) => (
          <Link key={item.id} to={`/stack/${item.id}`}>
            <Card className="transition-colors hover:border-[var(--border-strong)]">
              <CardHeader>
                <CardTitle className="text-base">{item.title}</CardTitle>
                <CardDescription className="line-clamp-2">{item.summary}</CardDescription>
                <p className="text-xs text-muted-foreground pt-1">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </PageContainer>
  )
}
