import { Quote } from 'lucide-react'

const testimonials = [
  {
    quote: "Stackr saved me hours of research. I described my SaaS idea and got a complete architecture in seconds. The trade-offs analysis is perfect.",
    name: 'Sarah Chen',
    role: 'Founding Engineer',
    company: 'Fintech Startup',
  },
  {
    quote: "I use it with every new client project. The diagrams are shareable and the explanations help our stakeholders understand easily.",
    name: 'Marcus Williams',
    role: 'Software Architect',
    company: 'Freelance',
  },
  {
    quote: "As a founder building my first product, Stackr gave me the confidence to make architecture decisions I wouldn't have known to make reliably.",
    name: 'Amina Diallo',
    role: 'Indie Developer',
    company: 'Self-employed',
  },
  {
    quote: "Our engineering team uses Stackr during sprint planning to quickly evaluate technology options. It's an indispensable part of our workflow.",
    name: 'James Park',
    role: 'VP of Engineering',
    company: 'ScaleUp',
  },
  {
    quote: "The alternative stack suggestions are brilliant. I went with the second option based on the trade-off analysis and it was the right choice.",
    name: 'Lena Müller',
    role: 'CTO',
    company: 'B2B SaaS Co.',
  },
  {
    quote: "Finally an architecture tool that doesn't just spit out buzzwords. It's technical enough to be useful and clear enough to share with teams.",
    name: 'David Osei',
    role: 'Senior Developer',
    company: 'Agency',
  },
  {
    quote: "I've evaluated several different architecture tools and this is the only one that actually understands my exact nuance of requirements.",
    name: 'Priya Nair',
    role: 'Platform Engineer',
    company: 'Series B Startup',
  },
  {
    quote: "What used to take a long whiteboard session and two engineers now takes thirty seconds. Stackr has changed how we approach all our projects.",
    name: 'Tom Becker',
    role: 'Engineering Lead',
    company: 'Remote-First Co.',
  },
]

function TestimonialCard({ quote, name, role, company }: (typeof testimonials)[0]) {
  return (
    <div className="mx-3 flex w-full max-w-sm shrink-0 flex-col gap-4 rounded-2xl border border-border bg-muted/30 p-6">
      <Quote className="w-8 h-8 text-primary opacity-80" />
      <div className="flex flex-col gap-4 flex-1">
        <p className="text-sm font-light text-muted-foreground leading-relaxed flex-1">
          "{quote}"
        </p>
        <div className="border-t border-border pt-4 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium text-foreground">
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{name}</p>
            <p className="text-xs font-light text-muted-foreground mt-0.5">
              {role} · {company}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function TestimonialsSection() {
  const row1 = [...testimonials.slice(0, 4), ...testimonials.slice(0, 4)]
  const row2 = [...testimonials.slice(4), ...testimonials.slice(4)]

  return (
    <section className="py-16 sm:py-20">

      {/* Header */}
      <div className="px-6 sm:px-4 mx-auto max-w-7xl mb-14">
        <p className="text-sm font-medium text-primary uppercase tracking-widest mb-5">
          Testimonials
        </p>
        <h2 className="text-5xl sm:text-6xl font-light tracking-tight leading-[1.1] max-w-2xl">
          Loved by builders{' '}
          <span className="font-semibold">everywhere.</span>
        </h2>
      </div>

      {/* First Row */}
      <div className="mx-auto max-w-7xl px-6 sm:px-4 relative overflow-hidden mb-6">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
        <div className="marquee-track">
          {row1.map((t, i) => <TestimonialCard key={i} {...t} />)}
        </div>
      </div>

      {/* Second Row */}
      <div className="mx-auto max-w-7xl px-6 sm:px-4 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
        <div className="marquee-track-reverse">
          {row2.map((t, i) => <TestimonialCard key={i} {...t} />)}
        </div>
      </div>

    </section>
  )
}
