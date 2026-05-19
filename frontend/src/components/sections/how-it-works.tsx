const steps = [
  {
    number: '01',
    title: 'Describe your project',
    description: 'Tell Stackr what you\'re building — what it does, who uses it, expected scale, and any constraints.',
    example: '"A real-time chat app for team collaboration."',
  },
  {
    number: '02',
    title: 'Pick your technologies',
    description: 'Choose from curated categories across frontend, backend, database, caching, DevOps or let AI decide.',
    example: 'React · Nest.js · PostgreSQL · Docker · AWS',
  },
  {
    number: '03',
    title: 'Get your blueprint',
    description: 'Receive a full architecture with diagrams, component explanations, trade-offs, and alternative stack options.',
    example: 'Diagram + written explanation + alternatives',
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-16 sm:py-20 px-6 sm:px-4">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-14 max-w-2xl">
          <p className="text-sm font-medium text-primary uppercase tracking-widest mb-5">
            How it works
          </p>
          <h2 className="text-5xl sm:text-6xl font-light tracking-tight leading-[1.1]">
            From idea to blueprint{' '}
            <span className="font-semibold">in three steps.</span>
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden">
          {steps.map(({ number, title, description, example }) => (
            <div key={number}
              className="bg-background p-10 flex flex-col gap-6 group hover:bg-muted/30 transition-colors duration-200"
            >
              {/* Number */}
              <span className="text-5xl font-light text-muted-foreground/30 tabular-nums">
                {number}
              </span>

              {/* Content */}
              <div className="flex flex-col gap-3">
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="text-base font-light text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </div>

              {/* Example chip */}
              <p className="mt-auto text-xs font-light text-muted-foreground/60 italic border-t border-border pt-4">
                {example}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
