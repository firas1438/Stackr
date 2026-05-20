import { BadGatewayException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { GoogleGenAI } from '@google/genai'
import { architectureOutputSchema, type ArchitectureOutput } from './architecture.schema'
import { stripJsonCodeBlock, normalizeDiagram, normalizeExplanation } from '../../utils/generation'


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
      throw new BadGatewayException('Issues connecting to the Gemini API.')
    }

    const model = this.config.get<string>('GEMINI_MODEL') ?? 'gemini-2.5-flash'
    const client = new GoogleGenAI({ apiKey })

    const stackLines =
      input.resolvedStack.length > 0
        ? input.resolvedStack.map((s) => `- ${s.category}: ${s.technology}`).join('\n')
        : '- (none selected, suggest a sensible default stack that matches the use case of the project)'

    const prompt = `
You are a senior software architect helping developers design modern web application architectures.

Project idea:
${input.idea}

Selected technologies:
${stackLines}

Respond with ONLY valid JSON (no markdown fences or extra prose) matching this schema:

{
  "title": "string - short simple architecture title",
  "summary": "string - 2-3 sentence overview",
  "explanation": "string - markdown with #### sections: how components connect, data flow, tradeoffs. Use bold titles with **-** at the start and : at the end. Keep each section very brief (2-3 short sentences each) and the whole explanation concise. Put each heading on its own line, then leave a blank line before the paragraph text. Use blank lines between paragraphs and sections. Do not put paragraph text on the same line as the heading.",
  "diagram": "string - valid Mermaid flowchart TB syntax only, 6-12 nodes max",
  "alternatives": [
    {
      "name": "string",
      "selections": { "categorySlug": "technologySlug" },
      "rationale": "string"
    }
  ]
}

Example explanation format:
#### **- System Overview:**

The architecture is built as a single-page frontend with a stateless API backend.

#### **- Component Connection and Data Flow:**

The frontend calls the backend over HTTPS and the backend stores data in the database.

#### **- Tradeoffs:**

This design is simple and scalable, but requires clear API contracts.

MERMAID DIAGRAM RULES — violating any of these will cause a parse error:

1. Node definitions MUST follow this exact format: ID[Label text] or ID(Label text) or ID{Label text} or ID([Label text])
   - The label is ONLY the text inside the brackets. NEVER add extra text after the closing bracket.
   - WRONG: FE --> CDN (Static Assets)
   - RIGHT: CDN[CDN Static Assets]  then  FE --> CDN

2. NEVER use parentheses () inside a label under any circumstances.
   - WRONG: DB([PostgreSQL (RDS)])
   - RIGHT:  DB([PostgreSQL RDS])

3. NEVER use angle brackets <> inside labels.

4. NEVER use bidirectional arrows <-->. They are not valid Mermaid flowchart syntax.
   - WRONG: BE <--> DB
   - RIGHT:  BE --> DB

5. Edge lines must end after the target node ID. Never append anything after it.
   - WRONG: A --> B (some note)
   - RIGHT:  A --> B

6. Only use these node shapes: [square], (round), {diamond}, ([stadium])

7. The diagram must start with exactly: flowchart TB

8. Keep it to 6-10 nodes maximum. Group related concerns into single nodes when needed.

GENERAL RULES:
- Use category slugs in alternatives.selections (e.g. frontend, backend, database, hosting).
- Include 0-2 alternatives only when they add real value.
- Be practical and opinionated for an MVP team.
- Do not include markdown code fences or any text outside the JSON object.
- Spacing is critically important: use blank lines after headings and between paragraphs.
- Do not place paragraph text on the same line as any #### heading.
- Keep the entire explanation short and concise (under 300 words).
- Titles must be formatted exactly as "#### **- Section Name:**".
- Always insert a blank line after each heading and between paragraphs.`

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

    const cleanText = stripJsonCodeBlock(text)

    let parsed: unknown
    try {
      parsed = JSON.parse(cleanText)
    } catch {
      throw new BadGatewayException('AI returned invalid JSON')
    }

    const normalized = normalizeDiagram(parsed)

    const result = architectureOutputSchema.safeParse(normalized)
    if (!result.success) {
      throw new BadGatewayException('AI response did not match expected schema')
    }

    return {
      ...result.data,
      explanation: normalizeExplanation(result.data.explanation),
    }
  }
}