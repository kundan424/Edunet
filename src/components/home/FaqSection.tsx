import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'How does an online Degree or MasterTrack differ from a short course?',
      answer: 'Degrees and MasterTrack™ credentials award formal university credits that appear on an official university transcript. They include faculty-graded capstone examinations, live oral defense sessions, and verified identity verification.'
    },
    {
      question: 'Can I audit courses for free without paying tuition?',
      answer: 'Yes. All Lumina academic reading materials, lecture monographs, and community discussions are completely open. Tuition is only charged if you submit projects to the live automated grading kernel and wish to receive an official accredited credential.'
    },
    {
      question: 'How do I qualify for need-based tuition assistance?',
      answer: 'Applications are reviewed on a rolling basis. Any student demonstrated with limited educational access can submit a brief 300-word statement explaining their academic goals. Approvals take fewer than 48 hours.'
    },
    {
      question: 'What are the system requirements for the interactive cloud kernel sandboxes?',
      answer: 'None beyond a modern web browser. All compiler pipelines, Linux kernel tracepoint tools, and GPU inference instances run remotely in dedicated QEMU/Firecracker microVMs at zero cost to you.'
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
