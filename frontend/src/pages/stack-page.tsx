import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { MermaidDiagram } from '@/components/mermaid-diagram'
import { PageContainer } from '@/components/page-container'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getStack } from '@/lib/api'

export function StackPage() {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading, isError } = useQuery({
    queryKey: ['stack', id],
    queryFn: () => getStack(id!),
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-32 text-muted-foreground gap-2">
          <Loader2 className="animate-spin" size={20} />
          Loading architecture…
        </div>
      </PageContainer>
    )
  }

  if (isError || !data) {
    return (
      <PageContainer>
        <div className="py-24 text-center">
          <p className="text-muted-foreground mb-4">Stack not found.</p>
          <Button asChild variant="outline">
            <Link to="/build">Back to build</Link>
          </Button>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2">
        <Link to="/build">
          <ArrowLeft size={16} />
          Build another
        </Link>
      </Button>

      <header className="mb-8">
        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{data.idea}</p>
        <h1 className="text-3xl font-extrabold tracking-tight">{data.title}</h1>
        <p className="mt-3 text-muted-foreground">{data.summary}</p>
      </header>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Architecture diagram</CardTitle>
          <CardDescription>How the components connect</CardDescription>
        </CardHeader>
        <CardContent>
          <MermaidDiagram chart={data.diagram} />
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Explanation</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-invert prose-sm max-w-none prose-headings:font-semibold prose-p:text-muted-foreground">
          <ReactMarkdown>{data.explanation}</ReactMarkdown>
        </CardContent>
      </Card>

      {data.alternatives && data.alternatives.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Alternative stacks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.alternatives.map((alt) => (
              <div key={alt.name} className="rounded-lg border border-[var(--border)] p-4">
                <h3 className="font-semibold">{alt.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{alt.rationale}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </PageContainer>
  )
}
