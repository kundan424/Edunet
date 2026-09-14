import { HeroSearch } from './HeroSearch';

export function HomeHero() {
  return (
    <section className="flex flex-col items-center text-center mt-12 md:mt-20 lg:mt-24 px-4 sm:px-6 w-full max-w-4xl mx-auto">
      <h1 className="font-degular-display text-5xl md:text-6xl lg:text-heading leading-heading font-bold text-midnight-ink tracking-tight mb-6">
        Learn without <span className="text-signal-blue relative inline-block">compromise.<svg className="absolute w-full h-3 -bottom-1 left-0 text-saffron-yellow opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0,5 Q50,10 100,5" stroke="currentColor" strokeWidth="8" fill="none"/></svg></span>
      </h1>
      
      <p className="font-usual text-lg md:text-xl text-midnight-ink/80 max-w-2xl mb-8 leading-relaxed">
        Master the skills of tomorrow in a focused, modern learning environment designed to remove friction and emphasize deep understanding.
      </p>

      <HeroSearch />
      
      {/* Bauhaus Geometric Hero Visual */}
      
    </section>
  );
}
