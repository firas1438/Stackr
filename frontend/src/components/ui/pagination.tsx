import * as React from 'react'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn('mx-auto flex w-full justify-center', className)}
      {...props}
    />
  )
}

export function PaginationContent({ className, ...props }: React.ComponentProps<'ul'>) {
  return (
    <ul
      className={cn('flex flex-row items-center gap-1.5', className)}
      {...props}
    />
  )
}

export function PaginationItem({ className, ...props }: React.ComponentProps<'li'>) {
  return <li className={className} {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
} & React.ComponentProps<typeof Button>

export function PaginationLink({
  className,
  isActive,
  ...props
}: PaginationLinkProps) {
  return (
    <Button
      aria-current={isActive ? 'page' : undefined}
      variant={isActive ? 'default' : 'ghost'}
      className={cn(
        'h-9 w-9 p-0 rounded-full text-xs font-semibold select-none transition-all duration-200',
        isActive && 'pointer-events-none bg-primary text-primary-foreground shadow-sm shadow-primary/20',
        className
      )}
      {...props}
    />
  )
}

export function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      className={cn('gap-1.5 w-auto px-3.5 rounded-3xl hover:bg-muted', className)}
      {...props}
    >
      <ChevronLeft size={16} />
      <span className="hidden sm:inline">Previous</span>
    </PaginationLink>
  )
}

export function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      className={cn('gap-1.5 w-auto px-3.5 rounded-3xl hover:bg-muted', className)}
      {...props}
    >
      <span className="hidden sm:inline">Next</span>
      <ChevronRight size={16} />
    </PaginationLink>
  )
}

export function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      aria-hidden
      className={cn('flex h-9 w-9 items-center justify-center text-muted-foreground', className)}
      {...props}
    >
      <MoreHorizontal size={16} />
      <span className="sr-only">More pages</span>
    </span>
  )
}
