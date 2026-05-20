import { useMutation, useQuery } from '@tanstack/react-query'
import { Loader2, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LayerCard } from '@/components/layer-card'
import { PageContainer } from '@/components/page-container'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { createStack, getCatalog } from '@/lib/api'
import { Layers } from 'lucide-react'

export function BuildPage() {
  const navigate = useNavigate()
  const [idea, setIdea] = useState('')
  const [selections, setSelections] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)

  const catalog = useQuery({ queryKey: ['catalog'], queryFn: getCatalog })

  const generate = useMutation({
    mutationFn: () => createStack({ idea: idea.trim(), selections }),
    onSuccess: (stack) => navigate(`/stack/${stack.id}`),
    onError: (err: Error) => setError(err.message),
  })

  const toggle = (categoryId: string, itemId: string) => {
    setSelections((prev) => {
      const next = { ...prev }
      if (next[categoryId] === itemId) delete next[categoryId]
      else next[categoryId] = itemId
      return next
    })
  }

  const pickedCount = Object.keys(selections).length
  const canGenerate = idea.trim().length >= 3

  return (
    <>
      {/* main content */}
      <PageContainer>

        {/* header */}
        <header className="mb-8">
          <div className="flex items-center gap-2.5">
            <Layers size={22} className="text-primary" />
            <h1 className="text-2xl font-semibold tracking-tight text-primary">Build your stack</h1>
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground">Describe your project and pick technologies. Stackr will explain how everything connects.</p>
        </header>

        {/* textarea */}
        <div className="mb-6">
          <label className="text-sm font-medium mb-2.5 block">Project idea</label>
          <Textarea
            placeholder="e.g. A real-time chat app for small teams"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            rows={3}
            maxLength={350}
            className="w-full"
          />
        </div>

        {/* catalog */}
        {catalog.isLoading && (
          <p className="text-center text-muted-foreground py-12">Loading technologies…</p>
        )}
        {catalog.isError && (
          <p className="text-center text-red-400 py-12">Could not load catalog. Is the API running?</p>
        )}
        {catalog.data && (
          <div>
            <label className="text-sm font-medium mb-2.5 block">Technology stack</label>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {catalog.data.categories.map((cat) => (
                <LayerCard
                  key={cat.id}
                  category={cat}
                  selectedId={selections[cat.id] ?? null}
                  onToggle={toggle}
                />
              ))}
            </div>
          </div>
        )}

      </PageContainer>

      {/* footer */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/90 backdrop-blur-md pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto flex h-auto max-w-7xl flex-col items-center justify-between gap-4 px-4 py-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            {pickedCount === 0
              ? 'No technologies selected'
              : `${pickedCount} layer${pickedCount === 1 ? '' : 's'} selected`}
          </p>
          {error && <p className="text-sm text-red-400 flex-1 text-center">{error}</p>}
          <Button
            disabled={!canGenerate || generate.isPending}
            onClick={() => { setError(null); generate.mutate() }}
          >
            {generate.isPending ? (
              <span className='text-sm text-muted flex items-center gap-2'>
                <Loader2 className="animate-spin" size={18} />
                Generating…
              </span>
            ) : (
              <span className='text-sm text-muted flex items-center gap-2'>
                <Sparkles size={18} />
                Generate architecture
              </span>
            )}
          </Button>
        </div>
      </div>
    </>
  )
}
