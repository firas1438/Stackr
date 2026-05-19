import { useState } from 'react'
import { Plus, Layers } from 'lucide-react'
import { cn } from '@/lib/utils'

const faqs = [
  {
    question: 'What is Stackr and who is it for?',
    answer: 'Stackr is an AI architecture tool for developers. Whether starting fresh or evaluating options, we generate complete recommendations with clear explanations and diagrams.',
  },
  {
    question: 'How does the AI architecture generation work?',
    answer: 'Describe your project and select categories. Using Gemini, Stackr analyses inputs to produce a tailored blueprint including explanations, design diagrams, and trade-offs.',
  },
  {
    question: 'Do I need to sign up to use Stackr?',
    answer: 'No signup is required to use the platform. You can start building immediately and all your generated stacks are saved in history to revisit anytime during your session.',
  },
  {
    question: 'What technology categories does Stackr support?',
    answer: 'We support modern frontend frameworks, backend runtimes, databases, caching layers, auth providers, cloud platforms, and devops tooling. The list is expanding regularly.',
  },
  {
    question: 'Can I use Stackr for existing projects?',
    answer: 'Absolutely. Describe your current setup and ask Stackr to evaluate it, suggest improvements, or recommend migration paths. Many teams use this for architecture reviews.',
  },
  {
    question: 'How accurate are the recommendations?',
    answer: 'Recommendations follow industry best practices and real patterns. While AI outputs should be reviewed by engineers, users consistently report high-quality, actionable insights.',
  },
]

function FaqItem({ question, answer, isOpen, onToggle, }: { question: string, answer: string, isOpen: boolean, onToggle: () => void }) {
  return (
    <div className="border-b border-border">
      <button onClick={onToggle} className="w-full flex items-center justify-between gap-6 py-6 text-left group" >
        <span className="text-md font-light text-foreground group-hover:text-primary transition-colors duration-200">
          {question}
        </span>
        <Plus size={18} className={cn('shrink-0 text-muted-foreground transition-transform duration-300', isOpen && 'rotate-45 text-primary',)} />
      </button>

      <div className={cn('overflow-hidden transition-all duration-300 ease-in-out',
        isOpen ? 'max-h-48 pb-6' : 'max-h-0',
      )}
      >
        <p className="text-base font-light text-muted-foreground leading-relaxed">
          {answer}
        </p>
      </div>
    </div>
  )
}

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-16 sm:py-20 px-6 sm:px-4">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

          {/* Left */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className="text-sm font-medium text-primary uppercase tracking-widest mb-5">
              FAQ
            </p>
            <h2 className="text-5xl sm:text-6xl font-light tracking-tight leading-[1.1]">
              Common{' '}
              <span className="font-semibold">questions.</span>
            </h2>
            <p className="mt-3 text-lg font-light text-muted-foreground leading-relaxed">
              Can't find your answer? Reach out and we'll get back to you.
            </p>
            <div className="mt-14 flex items-center justify-center">
              <Layers className="w-60 h-60 text-primary opacity-90" strokeWidth={1} />
            </div>
          </div>

          {/* Right */}
          <div>
            {faqs.map((faq, index) => (
              <FaqItem
                key={faq.question}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onToggle={() => setOpenIndex(openIndex === index ? null : index)}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
