import { BadGatewayException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { GoogleGenAI } from '@google/genai'
import {
  architectureOutputSchema,
  type ArchitectureOutput,
} from './architecture.schema'

export interface GenerateInput {
  idea: string
  resolvedStack: { category: string; technology: string }[]
}

@Injectable()
export class GeminiService {
  constructor(private readonly config: ConfigService) {}

  async generateArchitecture(input: GenerateInput): Promise<ArchitectureOutput> {
    const apiKey = this.config.get<string>('GEMINI_API_KEY')
    if (!apiKey) {
      throw new BadGatewayException(
        'GEMINI_API_KEY is not configured. Add it to your .env file.',
      )
    }

    const model = this.config.get<string>('GEMINI_MODEL') ?? 'gemini-2.5-flash'
    const client = new GoogleGenAI({ apiKey })

    const stackLines =
      input.resolvedStack.length > 0
        ? input.resolvedStack.map((s) => `- ${s.category}: ${s.technology}`).join('\n')
        : '- (none selected — suggest a sensible default stack)'

    const prompt = `You are a senior software architect helping developers design modern web application architectures.

Project idea:
${input.idea}

Selected technologies:
${stackLines}

Respond with ONLY valid JSON (no markdown fences) matching this schema:
{
  "title": "string — short architecture title",
  "summary": "string — 2-3 sentence overview",
  "explanation": "string — markdown with ## sections: how components connect, data flow, tradeoffs",
  "diagram": "string — valid Mermaid flowchart TB syntax only, 6-12 nodes max",
  "alternatives": [
    {
      "name": "string",
      "selections": { "categorySlug": "technologySlug" },
      "rationale": "string"
    }
  ]
}

Rules:
- Use category slugs in alternatives.selections (e.g. frontend, backend, database, hosting).
- Include 0-2 alternatives only when they add real value.
- Be practical and opinionated for an MVP team.
- diagram must be valid Mermaid starting with flowchart TB`

    const response = await client.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    })

    const text = response.text?.trim()
    if (!text) {
      throw new BadGatewayException('AI returned an empty response')
    }

    let parsed: unknown
    try {
      parsed = JSON.parse(text)
    } catch {
      throw new BadGatewayException('AI returned invalid JSON')
    }

    const result = architectureOutputSchema.safeParse(parsed)
    if (!result.success) {
      throw new BadGatewayException('AI response did not match expected schema')
    }

    return result.data
  }
}
