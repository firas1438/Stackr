import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageContainerProps {
  children: ReactNode
  className?: string
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={cn('mx-auto w-full max-w-7xl px-6 sm:px-4 py-8 sm:pt-10 sm:pb-12', className)}>
      {children}
    </div>
  )
}
