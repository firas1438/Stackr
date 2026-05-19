import { Check } from 'lucide-react'
import type { CatalogCategory, CatalogItem } from '@/lib/api'
import { ItemLogo } from '@/components/item-logo'
import { cn } from '@/lib/utils'

interface Props {
  category: CatalogCategory
  selectedId: string | null
  onToggle: (categoryId: string, itemId: string) => void
}

export function LayerCard({ category, selectedId, onToggle }: Props) {
  return (
    <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <header className="mb-3">
        <div className="text-[11px] font-bold tracking-[0.08em] uppercase text-[var(--text-primary)]">
          {category.name}
        </div>
        {category.subtitle && (
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">{category.subtitle}</p>
        )}
      </header>
      <div className="grid grid-cols-2 gap-2.5 md:flex md:flex-col md:gap-1.5">
        {category.items.map((item: CatalogItem) => {
          const selected = selectedId === item.id
          return (
            <button key={item.id} type="button"
              onClick={() => onToggle(category.id, item.id)}
              className={cn(
                'group relative rounded-xl border text-left transition-all active:scale-[0.98]',
                selected
                  ? 'border-[var(--accent)] bg-[var(--accent-soft)]'
                  : 'border-[var(--border)] bg-[var(--background)] hover:border-[var(--border-strong)]',
                'p-3.5 md:p-0 md:border-0 md:bg-transparent',
              )}
            >
              <div className="md:hidden">
                <ItemLogo name={item.name} domain={item.domain} itemId={item.id} size={32} />
                <div className="mt-2.5 text-[12px] font-bold leading-tight line-clamp-2">{item.name}</div>
                <span aria-hidden className={cn(
                  'absolute top-2 right-2 w-4 h-4 rounded-full border flex items-center justify-center',
                  selected ? 'border-[var(--accent)] bg-[var(--accent)]' : 'border-[var(--border-strong)]',
                )}
                >
                  {selected && <Check size={11} strokeWidth={3} className="text-white" />}
                </span>
              </div>
              <div
                className={cn(
                  'hidden md:flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg border transition-all',
                  selected
                    ? 'border-[var(--accent)] bg-[var(--accent-soft)]'
                    : 'border-[var(--border)] bg-[var(--background)] group-hover:border-[var(--border-strong)]',
                )}
              >
                <ItemLogo name={item.name} domain={item.domain} itemId={item.id} size={24} />
                <span className="text-sm font-medium flex-1">{item.name}</span>
                <span aria-hidden className={cn(
                  'flex-shrink-0 w-4 h-4 rounded-full border flex items-center justify-center',
                  selected ? 'border-[var(--accent)] bg-[var(--accent)]' : 'border-[var(--border-strong)]',
                )}
                >
                  {selected && <Check size={11} strokeWidth={3} className="text-white" />}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
