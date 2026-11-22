export function TestimonialsSection() {
  const testimonials = [
    {
      credential: 'MSc Degree Graduate',
      batch: 'Class of 2024',
      quote: 'Lumina’s partnership with Cambridge gave me the rigorous systems fundamentals I needed to bridge from Senior Developer to Principal Engineer at Stripe. Writing verified Raft implementations wasn’t theoretical—it redefined how I build resilient infrastructure.',
      name: 'Marcus Vance',
      role: 'Now Principal Infrastructure Eng',
      company: 'Stripe',
      image: '/images/marcus.jpg'
    },
    {
      credential: 'Stanford AI Spec',
      batch: 'Class of 2024',
      quote: 'The peer audits and automated benchmark grading harnesses felt like real production CI. I transitioned from general data engineering into an LLM alignment research team within four months of earning the Stanford certificate.',
      name: 'Dr. Amina K.',
      role: 'Research Scientist',
      company: 'Anthropic',
      image: '/images/amina.jpg'
    },
    {
      credential: 'MIT Formal Methods',
      batch: 'Class of 2023',
      quote: 'Having MIT CSAIL’s verified seal on my transcript and a suite of verified TLA+ specifications gave me immediate credibility when interviewing for safety-critical autonomous systems roles.',
      name: 'Julian Thorne',
      role: 'Systems Architect',
      company: 'DeepMind',
      image: '/images/elena.jpg'
    }
  ];

  const hiringPartners = [
    'Google DeepMind',
    'Stripe',
    'Anthropic',
    'OpenAI',
    'Cloudflare',
    'Apple'
  ];

  return (
    <section className="py-16 lg:py-24 border-b border-rule w-full" id="testimonials">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-ember"></span>
              <span>Alumni Stories</span>
            </div>
            <h2 className="font-sans text-2xl sm:text-3xl text-foreground font-semibold">
              From Curiosity to Staff Architect
            </h2>
          </div>
          <p className="font-body text-muted text-[14px] mt-2 sm:mt-0 max-w-[340px]">
            87% of students who completed a Lumina MasterTrack or Degree reported concrete career advancement within 6 months.
          </p>
        </div>

        {/* Testimonials 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <div 
              key={index}
              className="bg-card rounded-[10px] p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-rule flex flex-col justify-between hover:border-[#b7b7b5] transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono text-ember uppercase bg-wash px-2 py-0.5 rounded font-medium">
                    {t.credential}
                  </span>
                  <span className="text-[11px] font-mono text-muted">
                    {t.batch}
                  </span>
                </div>
                <p className="text-[14px] text-muted leading-relaxed mb-6 italic">
                  “{t.quote}”
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-rule">
                <img 
                  alt={t.name}
                  src={t.image}
                  className="w-10 h-10 rounded-full object-cover border border-rule"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=121212&color=f8f8f6`;
                  }}
                />
                <div>
                  <div className="font-medium text-foreground text-[13.5px]">
                    {t.name}
                  </div>
                  <div className="text-[11.5px] text-muted">
                    {t.role} · <span className="text-foreground font-semibold">{t.company}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Hiring Partner Logos / Text Banner */}
        <div className="mt-12 pt-8 border-t border-rule flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <span className="text-[12px] font-mono uppercase tracking-wider text-muted">
            Where Lumina graduates build:
          </span>
          <div className="flex flex-wrap items-center gap-6 sm:gap-10 text-muted font-semibold text-[14.5px]">
            {hiringPartners.map((partner, pIdx) => (
              <span key={pIdx} className="hover:text-foreground transition-colors">
                {partner}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
