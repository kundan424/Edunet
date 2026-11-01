export function PartnerMarquee() {
  const partners = [
    { name: 'MIT', department: 'CSAIL Lab', fontClass: 'font-bold tracking-tighter' },
    { name: 'Stanford', department: 'AI Institute', fontClass: 'font-bold tracking-tight' },
    { name: 'Cambridge', department: 'Systems Group', fontClass: 'font-serif italic font-medium' },
    { name: 'Carnegie Mellon', department: 'SCS', fontClass: 'font-semibold' },
    { name: 'ETH Zürich', department: 'D-INFK', fontClass: 'font-bold tracking-wider' },
    { name: 'Oxford', department: 'Dept. Computing', fontClass: 'font-serif font-medium' },
    { name: 'UC Berkeley', department: 'EECS', fontClass: 'font-semibold' },
  ];

  return (
    <section className="py-12 border-b border-[#e7e6e1] w-full">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-[780px] mx-auto mb-8">
          <p className="font-body text-xs uppercase tracking-wider text-[#7b7974] font-medium">
            We collaborate with 40+ leading universities and research institutes to bring accredited computing education to the world
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 lg:gap-16 opacity-90">
          {partners.map((partner, index) => (
            <div key={index} className="flex items-center gap-2 hover:opacity-100 transition-opacity">
              <span className={`font-heading text-[19px] sm:text-[20px] text-[#121212] ${partner.fontClass}`}>
                {partner.name}
              </span>
              <span className="text-[10px] font-mono uppercase text-[#7b7974] border-l border-[#e7e6e1] pl-2">
                {partner.department}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
