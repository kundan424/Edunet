export function PartnerMarquee() {
  const partners = [
    { name: 'Stanford', dept: 'AI INSTITUTE' },
    { name: 'MIT', dept: 'CSAIL LAB' },
    { name: 'Cambridge', dept: 'SYSTEMS GROUP' },
    { name: 'Carnegie Mellon', dept: 'SCHOOL OF CS' },
    { name: 'ETH Zürich', dept: 'D-INFK SYSTEMS' },
    { name: 'UC Berkeley', dept: 'EECS FACULTY' },
    { name: 'Oxford', dept: 'COMPUTING LAB' },
    { name: 'Harvard', dept: 'SEAS COMPUTING' },
    { name: 'Princeton', dept: 'CS THEORY GROUP' },
    { name: 'Caltech', dept: 'COMPUTING & MATH' },
  ];

  // Duplicate for seamless 0% -> -50% infinite moving belt loop
  const marqueeList = [...partners, ...partners];

  return (
    <section className="w-full bg-canvas py-12 sm:py-16 overflow-hidden transition-colors duration-150 relative">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 mb-8 text-center">
        {/* Centered Small Trust Heading */}
        <span className="font-mono text-xs uppercase tracking-[0.12em] text-muted">
          Institutional Alliances &amp; Research Labs Worldwide
        </span>
      </div>

      {/* Moving Belt Container with Fade Masks */}
      <div className="relative w-full overflow-hidden py-3">
        {/* Left edge fade gradient */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-canvas to-transparent z-10" />
        
        {/* Right edge fade gradient */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-canvas to-transparent z-10" />

        {/* Moving Belt Track */}
        <div className="animate-marquee-rtl flex items-center gap-14 sm:gap-20 whitespace-nowrap will-change-transform">
          {marqueeList.map((partner, index) => (
            <div 
              key={index} 
              className="flex-shrink-0 flex flex-col items-center justify-center text-center group cursor-default select-none px-2"
            >
              <span className="font-sans text-base sm:text-lg font-medium text-foreground tracking-tight group-hover:text-ember transition-colors">
                {partner.name}
              </span>
              <span className="font-mono text-[10px] sm:text-[11px] text-muted mt-1 uppercase tracking-wider group-hover:text-muted/80 transition-colors">
                {partner.dept}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

