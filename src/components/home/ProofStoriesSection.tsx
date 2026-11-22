import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Story {
  id: number;
  developer: string;
  role: string;
  initials: string;
  tag: string;
  image: string;
  quote: string;
}

export function ProofStoriesSection() {
  const stories: Story[] = [
    {
      id: 0,
      developer: 'Marcus Vance',
      role: 'Principal Infrastructure Eng · Stripe',
      initials: 'MV',
      tag: 'Distributed Systems',
      image: '/images/stories/cover-4.jpg',
      quote: 'Writing verified Raft implementations wasn’t theoretical—it redefined how I build resilient infrastructure. The automated harness confirmed zero race conditions before staff interviews.'
    },
    {
      id: 1,
      developer: 'Elena Rostova',
      role: 'Research Scientist · DeepMind',
      initials: 'ER',
      tag: 'NLP & Deep Learning',
      image: '/images/stories/cover-2.jpg',
      quote: 'The peer audits and automated benchmark grading harnesses felt like real production CI. Sharing cryptographically audited credentials on my CV gave hiring committees immediate assurance.'
    },
    {
      id: 2,
      developer: 'Dr. Amina Chen',
      role: 'Staff Systems Architect · CloudMesh',
      initials: 'AC',
      tag: 'MicroVM & Linux Kernel',
      image: '/images/stories/cover-3.jpg',
      quote: 'Each microVM sandbox gave me full root isolation to benchmark memory bottlenecks on live flamegraphs. Zero fluff in the explanations, 100% production-ready architecture.'
    },
    {
      id: 3,
      developer: 'Dr. David Thorne',
      role: 'Adjunct Professor · Algorithms',
      initials: 'DT',
      tag: 'Formal Verification',
      image: '/images/stories/cover-5.jpg',
      quote: 'As an educator and author, testing student algorithms against live adversarial test vectors in isolated worktrees has eliminated grading ambiguity completely.'
    },
    {
      id: 4,
      developer: 'Karan Patel',
      role: 'Tech Lead · Stripe',
      initials: 'KP',
      tag: 'Full-Stack Architecture',
      image: '/images/stories/cover-6.jpg',
      quote: 'I moved from junior developer to tech lead within eight months. The depth of the capstone projects and rubric feedback completely transformed my engineering standards.'
    },
    {
      id: 5,
      developer: 'Sophia Laurent',
      role: 'Security Engineer · AuroraSec',
      initials: 'SL',
      tag: 'Kernel Security',
      image: '/images/stories/cover-7.jpg',
      quote: 'Testing live exploit mitigations inside microVM worktrees instead of artificial mocks made all the difference. Highly recommended for any serious systems practitioner.'
    },
    {
      id: 6,
      developer: 'Alex Morgan',
      role: 'Distributed Systems Fellow',
      initials: 'AM',
      tag: 'High-Perf Compute',
      image: '/images/stories/cover-1.jpg',
      quote: 'Low-latency browser terminals and verifiable ECTS transcripts allowed me to upskill during breaks without configuration friction. The gold standard for modern craft.'
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const prevCard = useCallback(() => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : stories.length - 1));
  }, [stories.length]);

  const nextCard = useCallback(() => {
    setActiveIndex((prev) => (prev < stories.length - 1 ? prev + 1 : 0));
  }, [stories.length]);

  // Keyboard navigation when focused or scrolled into view
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowLeft') prevCard();
      if (e.key === 'ArrowRight') nextCard();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextCard, prevCard]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (diff > 45) prevCard();
    if (diff < -45) nextCard();
    touchStartX.current = null;
  };

  return (
    <section className="w-full bg-canvas py-24 lg:py-32 border-b border-rule transition-colors duration-150 overflow-hidden" id="voices">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
        
        {/* Header */}
        <div className="max-w-[672px] mb-12 sm:mb-16">
          <div className="superset-eyebrow mb-3">
            <span className="w-1.5 h-1.5 rounded-none bg-ember" />
            <span>VOICES WALL</span>
          </div>
          <h2 className="font-sans text-3xl sm:text-4xl lg:text-[46px] leading-[1.12] tracking-[-0.025em] text-foreground font-medium mb-4">
            Direct observations from developers who learned here.
          </h2>
          <p className="font-sans text-base sm:text-[17px] text-muted leading-relaxed">
            Unfiltered feedback from engineers, researchers, and university instructors using Edunet to build, certify, and teach.
          </p>
        </div>

        {/* 3D Apple Cover Flow Showcase with Reviews on Cards */}
        <div 
          ref={containerRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative w-full py-4 select-none flex flex-col items-center"
        >
          {/* Cover Flow 3D Stage */}
          <div 
            className="relative w-full h-[380px] sm:h-[430px] md:h-[460px] flex items-center justify-center overflow-visible"
            style={{
              perspective: '1100px',
              perspectiveOrigin: '50% 50%',
            }}
          >
            {stories.map((story, index) => {
              const offset = index - activeIndex;
              const absOffset = Math.abs(offset);
              const isActive = offset === 0;

              // 3D positioning
              let transform = '';
              let zIndex = 50 - absOffset;
              let opacity = 1;

              if (isActive) {
                transform = 'translateX(0px) translateZ(0px) rotateY(0deg) scale(1.04)';
                zIndex = 60;
                opacity = 1;
              } else if (offset < 0) {
                // Left side cards
                const xOffset = offset * 115 - 55;
                transform = `translateX(${xOffset}px) translateZ(-160px) rotateY(48deg) scale(0.88)`;
                opacity = Math.max(0.18, 1 - absOffset * 0.25);
              } else {
                // Right side cards
                const xOffset = offset * 115 + 55;
                transform = `translateX(${xOffset}px) translateZ(-160px) rotateY(-48deg) scale(0.88)`;
                opacity = Math.max(0.18, 1 - absOffset * 0.25);
              }

              // Hide far away cards to avoid visual overflow
              const isVisible = absOffset <= 3;
              if (!isVisible) return null;

              return (
                <div
                  key={story.id}
                  onClick={() => setActiveIndex(index)}
                  className="absolute w-[270px] h-[360px] sm:w-[310px] sm:h-[400px] md:w-[340px] md:h-[430px] rounded-[22px] overflow-hidden cursor-pointer will-change-transform group"
                  style={{
                    transform,
                    zIndex,
                    opacity,
                    transition: 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.4s ease, filter 0.4s ease, box-shadow 0.4s ease',
                    transformStyle: 'preserve-3d',
                    boxShadow: isActive
                      ? '0 25px 50px -12px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255, 255, 255, 0.22)'
                      : '0 12px 24px -8px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.08)',
                    filter: isActive ? 'brightness(1)' : 'brightness(0.6)',
                  }}
                >
                  {/* Background Colorful Image */}
                  <img
                    src={story.image}
                    alt={story.developer}
                    className="w-full h-full object-cover object-center pointer-events-none transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Dark Glass Scrim Overlay for Contrast & Legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/45" />

                  {/* Review Content on the Card */}
                  <div className="absolute inset-0 flex flex-col justify-between p-5 sm:p-6 text-white select-none">
                    {/* Top Row: 5 Stars & Course Tag */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1 text-[#f59e0b]">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-white/80 bg-white/15 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/15">
                        {story.tag}
                      </span>
                    </div>

                    {/* Middle: Authentic Developer Review Quote */}
                    <div className="my-auto py-2">
                      <p className="font-sans text-xs sm:text-[13.5px] leading-relaxed text-white/95 font-normal italic drop-shadow-sm">
                        “{story.quote}”
                      </p>
                    </div>

                    {/* Bottom: Reviewer Identity */}
                    <div className="pt-3 border-t border-white/15 flex items-center gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center font-bold text-xs sm:text-sm text-white shrink-0">
                        {story.initials}
                      </div>
                      <div className="min-w-0">
                        <div className="font-sans font-semibold text-xs sm:text-sm text-white truncate">
                          {story.developer}
                        </div>
                        <div className="font-sans text-[11px] text-white/70 truncate">
                          {story.role}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Subtle edge highlight */}
                  <div className="absolute inset-0 rounded-[22px] ring-1 ring-inset ring-white/15 pointer-events-none" />
                </div>
              );
            })}
          </div>

          {/* Controls: Left & Right Navigation Buttons & Scrubber Dots (No extra text below) */}
          <div className="flex items-center gap-4 mt-6">
            <button
              type="button"
              onClick={prevCard}
              aria-label="Previous observation"
              className="w-10 h-10 rounded-full border border-rule bg-wash hover:bg-rule/30 text-foreground flex items-center justify-center transition-all cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {/* Scrubber dots */}
            <div className="flex items-center gap-2 px-3">
              {stories.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Go to observation ${idx + 1}`}
                  className={`h-2 transition-all rounded-full cursor-pointer ${
                    activeIndex === idx 
                      ? 'w-6 bg-ember' 
                      : 'w-2 bg-rule hover:bg-foreground/40'
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={nextCard}
              aria-label="Next observation"
              className="w-10 h-10 rounded-full border border-rule bg-wash hover:bg-rule/30 text-foreground flex items-center justify-center transition-all cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
