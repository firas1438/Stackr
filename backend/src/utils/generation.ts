/**
 * Strips a ```json ... ``` or ``` ... ``` code fence from a string,
 * returning just the inner content. If no fence is found, returns the
 * trimmed string as-is.
 */
export function stripJsonCodeBlock(text: string): string {
  const match = /```(?:json)?\n([\s\S]*?)```/gm.exec(text)
  return match ? match[1].trim() : text.trim()
}

/**
 * Sanitizes a Mermaid flowchart string to fix common model mistakes:
 * - Removes parentheses inside node labels: A[PostgreSQL (RDS)] → A[PostgreSQL RDS]
 * - Removes angle brackets inside node labels
 * - Replaces invalid bidirectional arrows <--> with -->
 * - Strips stray trailing (...) text after edge target node IDs
 */
export function sanitizeMermaidDiagram(diagram: string): string {
  return diagram
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
      // Only matches lines that look like node definitions (word chars before the paren)
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

      // Replace invalid bidirectional arrows with one-directional
      result = result.replace(/<-->/g, '-->')

      // Strip stray trailing (...) label after target node on edge lines
      // e.g. "FE --> CDN (Static Assets)" → "FE --> CDN"
      result = result.replace(
        /^(\s*\w+\s*(?:-->|---|-\.->|===>|--[^>\n]*-->)\s*\w+)\s*\([^)]*\)\s*$/,
        '$1',
      )

      return result
    })
    .join('\n')
}

/**
 * Normalizes a parsed AI response object's diagram field:
 * - Strips markdown code fences
 * - Ensures the diagram starts with "flowchart TB"
 * - Runs sanitizeMermaidDiagram to fix common model mistakes
 */
export function normalizeDiagram(parsed: unknown): unknown {
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return parsed
  }

  const parsedObj = parsed as Record<string, unknown>
  const diagram = parsedObj.diagram
  if (typeof diagram !== 'string') {
    return parsed
  }

  let normalized = diagram.trim()
  normalized = normalized.replace(/^```(?:mermaid|flowchart)?\s*/i, '').replace(/```$/i, '').trim()

  if (!/^flowchart\s+TB/i.test(normalized) && normalized.length > 0) {
    normalized = `flowchart TB\n${normalized}`
  }

  normalized = sanitizeMermaidDiagram(normalized)

  return { ...parsedObj, diagram: normalized }
}

/**
 * Ensures every #### heading in a markdown explanation string is surrounded
 * by blank lines, fixing cases where the model omits them.
 */
export function normalizeExplanation(text: string): string {
  return text
    .replace(/([^\n])\n(####)/g, '$1\n\n$2')
    .replace(/(####[^\n]+)\n([^\n])/g, '$1\n\n$2')
}