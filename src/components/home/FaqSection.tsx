import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'How do courses and certificate tracks work on Lumina?',
      answer: 'Courses provide structured video lectures, downloadable resources, interactive quizzes, and assignments. Upon completing all required modules, you earn a verifiable course completion certificate.'
    },
    {
      question: 'Can I preview courses before enrolling?',
      answer: 'Yes. All course overviews, syllabi, learning objectives, and initial lecture previews are completely open so you can explore the curriculum before enrolling.'
    },
    {
      question: 'Are courses self-paced and do I get lifetime access?',
      answer: 'Yes. Enrolled students enjoy flexible self-paced learning and lifetime access to course videos, quizzes, assignments, and curriculum updates so you can study on your own schedule.'
    },
    {
      question: 'What are the technical requirements to participate?',
      answer: 'All you need is a modern web browser and a stable internet connection. All interactive quizzes, assignments, and video lectures work seamlessly across desktop and mobile devices.'
    }
  ];

  const toggleIndex = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-16 lg:py-20 border-b border-[#e7e6e1] w-full" id="faq">
      <div className="max-w-[760px] mx-auto px-4 sm:px-6 w-full text-left">
        
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#7b7974] mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d97757]"></span>
            <span>Curriculum Inquiries</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl text-[#121212] font-semibold">
            Frequently Addressed Questions
          </h2>
        </div>

        {/* FAQ List */}
        <div className="flex flex-col divide-y divide-[#e7e6e1]">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="py-4.5">
                <button
                  type="button"
                  onClick={() => toggleIndex(idx)}
                  className="w-full flex items-center justify-between text-left font-body text-[15.5px] text-[#121212] font-medium select-none cursor-pointer group"
                >
                  <span className="group-hover:text-[#000000] transition-colors pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown 
                    className={`w-4 h-4 text-[#7b7974] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#121212]' : ''
                    }`} 
                  />
                </button>
                {isOpen && (
                  <p className="text-[13.5px] text-[#373734] mt-3 leading-relaxed animate-in fade-in duration-200">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
