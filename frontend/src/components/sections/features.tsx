import { BrainCircuit, GitBranch, LayoutDashboard, Layers, Lightbulb, ShieldCheck, type LucideIcon } from 'lucide-react'

const features: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: BrainCircuit,
    title: 'AI Architecture Generator',
    description: 'Describe your project and receive a tailored architecture recommendation powered by Gemini AI.',
  },
  {
    icon: Layers,
    title: 'Layer-by-Layer Breakdown',
    description: 'Get a clear breakdown of every layer in your stack, from the frontend framework down to the database.',
  },
  {
    icon: GitBranch,
    title: 'Alternative Stacks',
    description: 'Explore curated alternative stacks with detailed trade-off analysis so you can make an informed decision.',
  },
  {
    icon: LayoutDashboard,
    title: 'Architecture Diagrams',
    description: 'Auto-generated Mermaid diagrams give you a clear visual map of how every component connects.',
  },
  {
    icon: Lightbulb,
    title: 'Smart Recommendations',
    description: 'Receive suggestions tuned to your project scale, team expertise, timeline, and budget requirements.',
  },
  {
    icon: ShieldCheck,
    title: 'Best Practices Built-in',
    description: 'Every architecture reflects proven industry standards for security, scalability, and maintainability.',
  },
]

export function FeaturesSection() {
  return (
    <section className="py-16 sm:py-20 px-6 sm:px-4">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-14 max-w-3xl">
          <p className="text-sm font-semibold font-mono text-primary uppercase tracking-widest mb-5">
            Features
          </p>
          <h2 className="text-5xl sm:text-6xl font-light tracking-tight leading-[1.1]">
            Everything you need to{' '}
            <span className="font-semibold">architect with confidence.</span>
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className="relative flex flex-col items-start overflow-hidden border border-border bg-muted/20 transition-colors duration-300 hover:bg-muted/10 hover:border-border/80 cursor-default" >
              {/* Dashed crosshair */}
              <div className="absolute inset-x-0 top-7 h-9.5 border-y border-dashed border-border bg-muted/30" />
              <div className="absolute inset-y-0 left-7 w-9.5 border-x border-dashed border-border bg-muted/30" />

              {/* Content */}
              <div className="relative isolate flex items-start justify-between gap-5 p-6">
                {/* Icon */}
                <div className="w-fit shrink-0 rounded-3xl bg-transparent p-1">
                  <div className="relative flex items-center justify-center border border-border size-9">
                    <Icon size={16} className="text-primary" />
                  </div>
                </div>

                {/* Text */}
                <div>
                  <h3 className="py-3 font-medium text-md">{title}</h3>
                  <p className="mt-4 mb-2 text-pretty text-muted-foreground font-light tracking-normal">
                    {description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
