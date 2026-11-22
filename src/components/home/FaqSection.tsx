import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'How do live Linux microVM sandboxes work on Edunet?',
      answer: 'Every module launches an isolated Firecracker microVM instance with dedicated hardware virtual memory. You receive direct terminal access with pre-configured compilers (LLVM, GCC, Rust), debuggers, and test suites that execute in real time with zero shared state.'
    },
    {
      question: 'How do course credits transfer to partner universities?',
      answer: 'Courses designated as Degree Pathways are developed directly with accredited faculty. Upon completing all milestones, you receive cryptographically signed transcripts eligible for direct ECTS (European Credit Transfer and Accumulation System) and US university graduate degree transfer.'
    },
    {
      question: 'Can enterprise teams deploy custom private curriculums?',
      answer: 'Yes. Edunet for Enterprise enables organizations to create private cohorts with custom repository test harnesses, SSO authentication, dedicated cloud GPU clusters, and unified developer skill analytics.'
    },
    {
      question: 'What are the hardware and network prerequisites?',
      answer: 'Because all compilation and execution occurs inside our low-latency cloud sandboxes, all you need is a modern web browser. WebSockets deliver low-latency terminal interactions (< 20ms) across desktop and tablet devices.'
    },
    {
      question: 'What happens if I fail a concept quiz or milestone checkpoint?',
      answer: 'You have unlimited retries for retention quizzes with instant randomized question variations and comprehensive code explanations so you can master the underlying mechanics before advancing.'
    }
  ];

  const toggleIndex = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="w-full bg-canvas py-24 lg:py-32 border-b border-rule transition-colors duration-150" id="faq">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
        
        {/* Split FAQ: 1:1.5 ratio with 80px gap */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* Left Column: Heading */}
          <div className="lg:col-span-5">
            <div className="superset-eyebrow mb-3">
              <span className="w-1.5 h-1.5 rounded-none bg-ember" />
              <span>QUESTIONS &amp; ANSWERS</span>
            </div>
            <h2 className="font-sans text-3xl sm:text-[40px] leading-[1.1] tracking-[-0.025em] text-foreground font-medium mb-4">
              Frequently addressed questions.
            </h2>
            <p className="font-sans text-[16px] text-muted leading-relaxed max-w-sm">
              Answers regarding our sandbox isolation, academic credit transfer policies, and enterprise team deployments.
            </p>
          </div>

          {/* Right Column: Wider question list with 24px padding and plus/minus glyphs */}
          <div className="lg:col-span-7 w-full flex flex-col border-t border-rule">
            {faqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={idx} className="border-b border-rule py-6">
                  <button
                    type="button"
                    onClick={() => toggleIndex(idx)}
                    className="w-full flex items-center justify-between text-left cursor-pointer group focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    {/* Question text: Inter 500 · 18px/28px */}
                    <span className="font-sans text-[18px] leading-[28px] font-medium text-foreground group-hover:text-ember transition-colors pr-6">
                      {faq.question}
                    </span>
                    <div className="w-6 h-6 border border-rule flex items-center justify-center text-muted group-hover:text-ember group-hover:border-ember transition-colors shrink-0">
                      {isOpen ? (
                        <Minus className="w-3.5 h-3.5" />
                      ) : (
                        <Plus className="w-3.5 h-3.5" />
                      )}
                    </div>
                  </button>
                  {isOpen && (
                    <p className="font-sans text-[16px] leading-[26px] text-muted mt-3.5 animate-in fade-in duration-150">
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
