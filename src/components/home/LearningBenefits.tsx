export function LearningBenefits() {
  const benefits = [
    {
      title: 'Structured Curriculum',
      description: 'Follow clear, step-by-step learning paths instead of disjointed tutorials. Every lesson builds on the last.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      )
    },
    {
      title: 'Learn at Your Own Pace',
      description: 'No deadlines. No pressure. Revisit complex topics whenever you need, and practice until you master them.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Interactive Practice',
      description: 'Solidify your knowledge with integrated quizzes and hands-on assignments reviewed by instructors.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      )
    },
    {
      title: 'Expert Instructors',
      description: 'Learn directly from verified industry professionals who bring real-world experience to their teaching.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

  return (
    <section className="py-20 md:py-32 px-4 sm:px-6 md:px-8 w-full bg-cream-paper relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-saffron-yellow/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-signal-blue/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

      <div className="max-w-[1200px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="flex flex-col gap-6">
            <h2 className="font-degular-display text-4xl md:text-5xl font-bold text-midnight-ink leading-tight">
              Structured for <span className="text-signal-blue">clarity.</span>
            </h2>
            <p className="font-usual text-lg md:text-xl text-midnight-ink/80 leading-relaxed max-w-lg">
              Our platform replaces cluttered dashboards with clean, focused environments. Every lesson, quiz, and assignment is crafted to let the content breathe, helping you learn faster.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex flex-col gap-4 p-6 bg-white rounded-2xl border border-midnight-ink/10 shadow-sm hover:border-signal-blue/50 transition-colors">
                <div className="w-14 h-14 bg-cream-paper rounded-xl flex items-center justify-center text-signal-blue border border-midnight-ink/10">
                  {benefit.icon}
                </div>
                <h3 className="font-degular-display text-xl font-bold text-midnight-ink">
                  {benefit.title}
                </h3>
                <p className="font-usual text-sm text-midnight-ink/70 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
