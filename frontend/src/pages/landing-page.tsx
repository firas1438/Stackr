import { HeroSection } from '@/components/sections/hero'
import { FeaturesSection } from '@/components/sections/features'
import { HowItWorksSection } from '@/components/sections/how-it-works'
import { TestimonialsSection } from '@/components/sections/testimonials'
import { FaqSection } from '@/components/sections/faq'
import { CtaSection } from '@/components/sections/cta'

export function LandingPage() {
  return (
    <div className="relative overflow-x-hidden">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaSection />
    </div>
  )
}
