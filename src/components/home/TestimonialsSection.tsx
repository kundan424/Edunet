export function TestimonialsSection() {
  // Using Option A: Clearly labeled sample/demo content because there is no global reviews endpoint
  const testimonials = [
    {
      id: 1,
      name: 'Chintu chuhar',
      role: 'Frontend Developer',
      content: 'The curriculum structure here is completely different from other platforms. It feels like a masterclass rather than a bunch of fragmented videos.',
      rating: 5
    },
    {
      id: 2,
      name: 'Sunil Michael',
      role: 'Data Analyst',
      content: 'I love how distraction-free the environment is. The quizzes actually forced me to apply what I learned immediately.',
      rating: 5
    },
    {
      id: 3,
      name: 'Soni Elena',
      role: 'UX Designer',
      content: 'Finally, a learning platform that respects design. It is so easy to find my way around, and the course quality is exceptionally high.',
      rating: 4
    }
  ];

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 md:px-8 w-full max-w-[1200px] mx-auto">
      <div className="flex flex-col items-center text-center gap-4 mb-16">
        <h2 className="font-degular-display text-3xl md:text-4xl font-bold text-midnight-ink">
          Learner Stories
        </h2>
        <div className="bg-saffron-yellow text-black border border-saffron-yellow/40 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          Demo Content
        </div>
        <p className="font-usual text-midnight-ink/70 max-w-2xl">
          Hear how our focused approach to education is helping students achieve their goals and master new technical skills.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map(t => (
          <div key={t.id} className="flex flex-col gap-6 p-8 border border-midnight-ink/20 rounded-2xl bg-cream-paper shadow-sm hover:shadow-md transition-shadow">
            <div className="flex text-saffron-yellow">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className={`w-5 h-5 ${i < t.rating ? 'fill-current' : 'text-midnight-ink/10 fill-current'}`} viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="font-usual text-midnight-ink/80 text-lg leading-relaxed flex-grow midnight-ink">
              "{t.content}"
            </p>
            <div className="flex items-center gap-4 pt-6 border-t border-midnight-ink/10">
              <div className="w-10 h-10 rounded-full bg-signal-blue/10 flex items-center justify-center font-degular-display font-bold text-signal-blue">
                {t.name.charAt(0)}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-midnight-ink text-sm">{t.name}</span>
                <span className="text-xs text-midnight-ink/60">{t.role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
