import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function CtaSection() {
  return (
    <section className="py-12 sm:py-16 px-6 sm:px-4 mb-8">
      <div className="mx-auto max-w-7xl opacity-95">
        <div className="relative rounded-2xl bg-primary px-8 sm:px-12 py-12 sm:py-16 overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center opacity-40"
            style={{ backgroundImage: 'url(/pattern.png)' }}
          />
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">

            {/* Left */}
            <div className="text-center lg:text-left">
              <p className="text-sm font-bold text-muted/70 uppercase tracking-widest mb-3">
                Get started
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-muted leading-tight max-w-4xl">
                Ready to design your perfect stack?
              </h2>
              <p className="mt-4 font-bold sm:text-lg font-light text-muted/95 max-w-md">
                No signup required. Get a complete architecture blueprint in seconds.
              </p>
            </div>

            {/* Right */}
            <div className="shrink-0 w-full sm:w-auto">
              <Button asChild size="lg" className="bg-muted hover:bg-muted/90 font-semibold gap-2 text-primary-foreground w-full sm:w-auto justify-center" >
                <Link to="/build">
                  Start building
                  <ArrowRight size={16} />
                </Link>
              </Button>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
