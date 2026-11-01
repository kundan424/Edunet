import { Link } from 'react-router-dom';
import { Terminal, GraduationCap, Building2, CheckCircle2, ArrowRight } from 'lucide-react';

export function LearningBenefits() {
  const pillars = [
    {
      icon: Terminal,
      title: 'Job-Ready Skills & Sandboxes',
      description: 'Execute live workloads in isolated Linux microVMs. Write production code against automated test harnesses that mimic FAANG and tier-1 lab infrastructure.',
      bullets: [
        'Interactive QEMU/Firecracker sandbox',
        'Portfolio of 6+ audited GitHub repositories'
      ],
      linkText: 'Browse Professional Certs',
      linkHref: '/courses?search=Certificate'
    },
    {
      icon: GraduationCap,
      title: 'Transferable University Degrees',
      description: 'Start with a MasterTrack™ or MicroMasters credential and transfer earned credits directly toward an accredited Master of Science with partner universities.',
      bullets: [
        'Same university diploma as on-campus',
        'Fraction of the on-campus tuition cost'
      ],
      linkText: 'Explore Online Degrees',
      linkHref: '/courses?search=Degree'
    },
    {
      icon: Building2,
      title: 'Upskill Engineering Organizations',
      description: 'Custom enterprise cohorts designed for tech leads and staff engineers. Private benchmarks, team performance analytics, and tailored faculty instruction.',
      bullets: [
        'Skill benchmarking & SLA audit reporting',
        'Dedicated faculty office hours for your org'
      ],
      linkText: 'Lumina for Enterprise',
      linkHref: '#enterprise-section'
    }
  ];

  return (
    <section className="py-16 lg:py-24 border-b border-[#e7e6e1] w-full" id="outcomes">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-[720px] mb-12 text-left">
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#7b7974] mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d97757]"></span>
            <span>Outcome Framework</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl text-[#121212] leading-tight font-semibold">
            Achieve your specific academic &amp; career ambitions
          </h2>
          <p className="font-body text-[#373734] text-sm sm:text-base mt-2 leading-relaxed">
            Whether preparing for a Staff Engineer promotion, pivoting to AI research, or earning an accredited university degree while working full-time.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div 
                key={idx}
                className="bg-[#ffffff] rounded-[20px] p-7 border border-[#e7e6e1] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:border-[#b7b7b5] transition-all"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#efeeeb] flex items-center justify-center text-[#121212] mb-5">
                    <Icon className="w-6 h-6 text-[#121212]" />
                  </div>
                  <h3 className="font-heading text-[22px] text-[#121212] mb-2 leading-snug">
                    {pillar.title}
                  </h3>
                  <p className="text-[13.5px] text-[#373734] leading-relaxed mb-5">
                    {pillar.description}
                  </p>
                  <ul className="text-[12.5px] text-[#373734] space-y-2 mb-6">
                    {pillar.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#d97757] shrink-0" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-5 border-t border-[#e7e6e1]">
                  {pillar.linkHref.startsWith('#') ? (
                    <a 
                      href={pillar.linkHref}
                      className="text-[13px] font-medium text-[#121212] hover:text-[#d97757] inline-flex items-center gap-1 transition-colors"
                    >
                      <span>{pillar.linkText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <Link 
                      to={pillar.linkHref}
                      className="text-[13px] font-medium text-[#121212] hover:text-[#d97757] inline-flex items-center gap-1 transition-colors"
                    >
                      <span>{pillar.linkText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
