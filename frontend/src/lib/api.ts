const API_BASE = import.meta.env.VITE_API_URL ?? '/api/v1'

export interface CatalogItem {
  id: string
  name: string
  domain?: string
}

export interface CatalogCategory {
  id: string
  name: string
  subtitle?: string | null
  items: CatalogItem[]
}

export interface StackRecord {
  id: string
  idea: string
  selections: Record<string, string>
  title: string
  summary: string
  explanation: string
  diagram: string
  alternatives: Alternative[]
  createdAt: string
}

export interface Alternative {
  name: string
  selections: Record<string, string>
  rationale: string
}

export interface StackListItem {
  id: string
  idea: string
  title: string
  summary: string
  selections: Record<string, string>
  createdAt: string
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message ?? body.error ?? `Request failed (${res.status})`)
  }
  return res.json() as Promise<T>
}

export function getCatalog() {
  return request<{ categories: CatalogCategory[] }>('/catalog')
}

export function createStack(body: { idea: string; selections: Record<string, string> }) {
  return request<StackRecord>('/stacks', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function getStack(id: string) {
  return request<StackRecord>(`/stacks/${id}`)
}

export function listStacks(page = 1, limit = 20) {
  return request<{
    items: StackListItem[]
    page: number
    limit: number
    total: number
  }>(`/stacks?page=${page}&limit=${limit}`)
}

export function faviconUrl(domain: string) {
  return `${API_BASE}/favicon?domain=${encodeURIComponent(domain)}`
}
