import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { BackgroundPattern } from '@/components/ui/background-pattern'

const techPills = [
  'Next.js', 'React', 'Node.js', 'PostgreSQL', 'Redis',
  'Docker', 'Kubernetes', 'Prisma', 'GraphQL', 'TypeScript',
  'Supabase', 'Tailwind', 'AWS', 'Vercel', 'MongoDB',
]

export function HeroSection() {
  const doubled = [...techPills, ...techPills]

  return (
    <section className="relative min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center text-center px-6 sm:px-14 py-14 sm:py-24 overflow-hidden">
      <BackgroundPattern />

      {/* Badge */}
      <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1.5 text-sm font-medium text-muted-foreground mb-8">
        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
        AI-powered architecture designer
      </div>

      {/* Headline */}
      <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight leading-[1.0] max-w-5xl">
        Design your stack
        <br />
        <span className="font-semibold text-primary">
          Understand how it <span className="underline">fits</span>
        </span>
      </h1>

      {/* Subtitle */}
      <p className="mt-8 text-md sm:text-lg font-light text-muted-foreground max-w-2xl leading-relaxed">
        Describe your project, pick your technologies, and get a clear architecture blueprint
        with diagrams, trade-offs, and AI-powered recommendations.
      </p>

      {/* CTAs */}
      <div className="mt-10 flex flex-wrap gap-3 justify-center">
        <Button asChild size="lg" className="gap-2 text-muted font-bold">
          <Link to="/build">
            Start building
            <ArrowRight size={16} />
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/history">Browse examples</Link>
        </Button>
      </div>

      {/* Marquee */}
      <div className="relative mt-18 w-full max-w-5xl overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
        <div className="marquee-track">
          {doubled.map((pill, i) => (
            <span key={i}
              className="mx-2 shrink-0 rounded-full border border-border bg-muted/50 px-4 py-2 text-sm font-light text-muted-foreground"
            >
              {pill}
            </span>
          ))}
        </div>
      </div>

    </section>
  )
}
