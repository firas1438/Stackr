import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
})

interface Props {
  chart: string
}

export function MermaidDiagram({ chart }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!ref.current || !chart) return
    let cancelled = false
    const id = `mermaid-${Math.random().toString(36).slice(2)}`

    mermaid
      .render(id, chart)
      .then(({ svg }) => {
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg
          setError(null)
        }
      })
      .catch(() => {
        if (!cancelled) setError('Could not render diagram')
      })

    return () => {
      cancelled = true
    }
  }, [chart])

  if (error) {
    return (
      <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs text-muted-foreground">{chart}</pre>
    )
  }

  return <div ref={ref} className="flex justify-center overflow-x-auto [&_svg]:max-w-full" />
}
