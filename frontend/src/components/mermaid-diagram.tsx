import { useEffect, useState } from 'react'
import mermaid from 'mermaid'

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  suppressErrorRendering: true,
})

interface Props {
  chart: string
}

// Global promise chain to serialize all mermaid.render calls.
// Since Mermaid's rendering is stateful and asynchronous, concurrent calls can clash
// and cause false-positive "Syntax error in text" failures.
let renderPromiseChain = Promise.resolve<any>(null)

function sequentialRender(id: string, text: string): Promise<{ svg: string; bindFunctions?: (el: Element) => void }> {
  const nextPromise = renderPromiseChain.then(
    () => mermaid.render(id, text),
    () => mermaid.render(id, text) // Fallback if previous rendering rejected
  )
  
  // Ensure the chain always recovers to a resolved promise to prevent blocking subsequent renders
  renderPromiseChain = nextPromise.catch(() => null)
  
  return nextPromise
}

/**
 * Client-side sanitizer as a last line of defense against model output mistakes.
 * Mirrors the server-side sanitizeMermaidDiagram logic.
 */
function sanitizeChart(chart: string): string {
  return chart
    .split('\n')
    .map((line) => {
      let result = line

      // Fix [..] and ([..]) node labels: remove inner () and <>
      result = result.replace(
        /(\[|\(\[)([^\]\)]+?)(\]|\]\))/g,
        (_m, open, content, close) => {
          const cleaned = content
            .replace(/\([^)]*\)/g, '')
            .replace(/[<>]/g, '')
            .replace(/\s+/g, ' ')
            .trim()
          return `${open}${cleaned}${close}`
        },
      )

      // Fix round-node definitions: ID(Label (inner)) → ID(Label inner)
      result = result.replace(
        /^(\s*\w+)\(([^)]+)\)/,
        (_m, id, content) => {
          const cleaned = content
            .replace(/\([^)]*\)/g, '')
            .replace(/[<>]/g, '')
            .replace(/\s+/g, ' ')
            .trim()
          return `${id}(${cleaned})`
        },
      )

      // Replace invalid <--> with -->
      result = result.replace(/<-->/g, '-->')

      // Strip stray trailing (...) after target node on edge lines
      result = result.replace(
        /^(\s*\w+\s*(?:-->|---|-\.->|===>|--[^>\n]*-->)\s*\w+)\s*\([^)]*\)\s*$/,
        '$1',
      )

      return result
    })
    .join('\n')
}

export function MermaidDiagram({ chart }: Props) {
  const [svg, setSvg] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!chart) return
    
    let cancelled = false
    const id = `mermaid-${Math.random().toString(36).slice(2)}`
    const sanitized = sanitizeChart(chart)

    sequentialRender(id, sanitized)
      .then(({ svg: renderedSvg }) => {
        if (!cancelled) {
          setSvg(renderedSvg)
          setError(null)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error('Mermaid render error:', err, '\nOriginal chart:\n', chart, '\nSanitized chart:\n', sanitized)
          setError('Could not render diagram')
        }
      })

    return () => {
      cancelled = true
    }
  }, [chart])

  if (error) {
    return (
      <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs text-muted-foreground">
        {chart}
      </pre>
    )
  }

  if (!svg) {
    return (
      <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
        Rendering diagram...
      </div>
    )
  }

  return (
    <div
      dangerouslySetInnerHTML={{ __html: svg }}
      className="flex justify-center overflow-x-auto [&_svg]:max-w-full"
    />
  )
}