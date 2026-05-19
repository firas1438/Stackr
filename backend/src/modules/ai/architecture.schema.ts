import { z } from 'zod'

export const alternativeSchema = z.object({
  name: z.string(),
  selections: z.record(z.string()),
  rationale: z.string(),
})

export const architectureOutputSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  explanation: z.string().min(1),
  diagram: z.string().min(1),
  alternatives: z.array(alternativeSchema).optional().default([]),
})

export type ArchitectureOutput = z.infer<typeof architectureOutputSchema>
