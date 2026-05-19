import { useState, useSyncExternalStore } from 'react'
import { faviconUrl } from '@/lib/api'
import { initialsFor } from '@/shared/icons'
import { THESVG_SLUGS, thesvgUrl } from '@/shared/iconslugs'

type Stage = 'thesvg' | 'favicon' | 'initials'

interface Props {
  name: string
  domain?: string
  itemId?: string
  size: number
  rounded?: number
}

function useIsDark(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const obs = new MutationObserver(onChange)
      obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
      return () => obs.disconnect()
    },
    () => document.documentElement.classList.contains('dark'),
    () => true,
  )
}

function isValidDomain(d: string | undefined): d is string {
  if (!d || d.length > 253) return false
  if (!/^[a-z0-9.-]+$/i.test(d)) return false
  if (d.startsWith('.') || d.endsWith('.')) return false
  if (d.startsWith('-') || d.endsWith('-')) return false
  if (!d.includes('.')) return false
  if (/^\d+\.\d+\.\d+\.\d+$/.test(d)) return false
  return true
}

export function ItemLogo({ name, domain, itemId, size, rounded }: Props) {
  const slug = itemId ? THESVG_SLUGS[itemId] : undefined
  const hasSlug = typeof slug === 'string' && slug.length > 0
  const hasFavicon = isValidDomain(domain)
  const initialStage: Stage = hasSlug ? 'thesvg' : hasFavicon ? 'favicon' : 'initials'
  const slotKey = `${domain ?? ''}|${slug ?? ''}`
  const [prevSlotKey, setPrevSlotKey] = useState(slotKey)
  const [stage, setStage] = useState<Stage>(initialStage)
  const effectiveStage = prevSlotKey !== slotKey ? initialStage : stage
  if (prevSlotKey !== slotKey) {
    setPrevSlotKey(slotKey)
    setStage(initialStage)
  }
  const radius = rounded ?? Math.round(size * 0.22)
  const isDark = useIsDark()

  if (effectiveStage === 'initials') {
    return (
      <div
        aria-hidden
        style={{
          width: size,
          height: size,
          flexShrink: 0,
          borderRadius: radius,
          background: isDark ? '#15171a' : '#ffffff',
          color: isDark ? '#ffffff' : '#0a0a0a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: Math.max(10, Math.round(size * 0.38)),
          fontWeight: 800,
          letterSpacing: '-0.02em',
        }}
      >
        {initialsFor(name)}
      </div>
    )
  }

  const src = effectiveStage === 'thesvg' ? thesvgUrl(slug as string) : faviconUrl(domain as string)

  return (
    <img
      src={src}
      alt={name}
      width={size}
      height={size}
      crossOrigin="anonymous"
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: radius,
        objectFit: 'contain',
        background: '#ffffff',
        border: '1px solid var(--border)',
        padding: Math.max(2, Math.round(size * 0.08)),
        boxSizing: 'border-box',
      }}
      onError={() => {
        if (effectiveStage === 'thesvg' && hasFavicon) setStage('favicon')
        else setStage('initials')
      }}
    />
  )
}
