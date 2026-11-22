import { ShieldCheck } from 'lucide-react';
import { FanDeckCard, type DeckCard } from '../ui/fan-deck-card';

export function SecurityAssuranceSection() {
  const securityCards: DeckCard[] = [
    {
      id: 'microvm',
      title: 'Isolated MicroVM Sandboxes',
      meta: 'SOC2 TYPE II · DEDICATED RAM',
      tint: '#d25611',
      blurb: 'Dedicated memory space and sandboxed container runtimes ensure code and projects execute with complete fault isolation and zero shared state.',
      art: (
        <svg viewBox="0 0 200 140" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="g-vm" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1a120c" />
              <stop offset="100%" stopColor="#0d0906" />
            </linearGradient>
            <radialGradient id="r-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#d25611" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#d25611" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="200" height="140" fill="url(#g-vm)" />
          <circle cx="100" cy="70" r="50" fill="url(#r-glow)" />
          {/* MicroVM Box Diagram */}
          <rect x="40" y="30" width="120" height="80" rx="8" fill="#1e1814" stroke="#d25611" strokeWidth="1.5" strokeOpacity="0.5" />
          <rect x="52" y="44" width="30" height="24" rx="4" fill="#2d221a" stroke="#d25611" strokeWidth="1" strokeOpacity="0.6" />
          <rect x="88" y="44" width="60" height="24" rx="4" fill="#221b16" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.1" />
          <rect x="52" y="76" width="96" height="20" rx="4" fill="#17120e" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.15" />
          {/* Glowing pulse indicator */}
          <circle cx="67" cy="56" r="3" fill="#22c55e" />
          <text x="96" y="59" fill="#ededed" fontSize="7" fontFamily="monospace">MICROVM // 0.4ms</text>
          <text x="60" y="89" fill="#d25611" fontSize="7" fontFamily="monospace">TLS 1.3 · ENCLAVE READY</text>
        </svg>
      )
    },
    {
      id: 'credentials',
      title: 'Verifiable Digital Credentials',
      meta: 'ASN.1 AUDITED · ECTS COMPATIBLE',
      tint: '#22c55e',
      blurb: 'Cryptographically audited certificate IDs, immutable transcripts, and public verification links tailored for LinkedIn and technical recruiters.',
      art: (
        <svg viewBox="0 0 200 140" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="g-cred" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0c1811" />
              <stop offset="100%" stopColor="#060d09" />
            </linearGradient>
            <radialGradient id="r-cred-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="200" height="140" fill="url(#g-cred)" />
          <circle cx="100" cy="70" r="50" fill="url(#r-cred-glow)" />
          {/* Certificate Badge Vector */}
          <rect x="45" y="25" width="110" height="90" rx="6" fill="#112217" stroke="#22c55e" strokeWidth="1.5" strokeOpacity="0.5" />
          <circle cx="100" cy="55" r="16" fill="#1b3624" stroke="#22c55e" strokeWidth="1.2" />
          <path d="M94 55 L98 59 L107 49" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="62" y="80" width="76" height="4" rx="2" fill="#22c55e" fillOpacity="0.4" />
          <rect x="74" y="88" width="52" height="4" rx="2" fill="#ffffff" fillOpacity="0.2" />
          <text x="100" y="103" textAnchor="middle" fill="#86efac" fontSize="6.5" fontFamily="monospace">ON-CHAIN VERIFIED</text>
        </svg>
      )
    },
    {
      id: 'integrity',
      title: 'Strict Learner Data Integrity',
      meta: 'AES-256 GCM · ZERO AD TRACKING',
      tint: '#6366f1',
      blurb: 'All user records, payment transactions, and assessment scores are protected under SOC2-aligned encryption standards with zero ad tracking.',
      art: (
        <svg viewBox="0 0 200 140" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="g-sec" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#111226" />
              <stop offset="100%" stopColor="#080914" />
            </linearGradient>
            <radialGradient id="r-sec-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="200" height="140" fill="url(#g-sec)" />
          <circle cx="100" cy="70" r="55" fill="url(#r-sec-glow)" />
          {/* Shield & Cipher Vector */}
          <path d="M100 30 L135 45 V75 C135 98 100 112 100 112 C100 112 65 98 65 75 V45 Z" fill="#1a1c38" stroke="#6366f1" strokeWidth="1.5" strokeOpacity="0.6" />
          {/* Lock inside shield */}
          <rect x="91" y="65" width="18" height="14" rx="3" fill="#6366f1" />
          <path d="M94 65 V58 C94 54.5 96.5 52 100 52 C103.5 52 106 54.5 106 58 V65" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" />
          <circle cx="100" cy="71" r="2" fill="#080914" />
          <text x="100" y="98" textAnchor="middle" fill="#a5b4fc" fontSize="6.5" fontFamily="monospace">AES-256 CIPHER</text>
        </svg>
      )
    },
    {
      id: 'rubrics',
      title: 'Automated Rubric Validation',
      meta: 'INSTANT GRADING · ZERO BIAS',
      tint: '#06b6d4',
      blurb: 'Assignments and code submissions are evaluated across deterministic integration tests and automated rubrics with instant feedback.',
      art: (
        <svg viewBox="0 0 200 140" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="g-rub" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0a181c" />
              <stop offset="100%" stopColor="#050c0e" />
            </linearGradient>
            <radialGradient id="r-rub-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="200" height="140" fill="url(#g-rub)" />
          <circle cx="100" cy="70" r="50" fill="url(#r-rub-glow)" />
          {/* Assessment Rubric Checklist */}
          <rect x="44" y="28" width="112" height="84" rx="6" fill="#10252b" stroke="#06b6d4" strokeWidth="1.5" strokeOpacity="0.5" />
          <path d="M56 46 L60 50 L68 42" fill="none" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" />
          <rect x="74" y="44" width="66" height="4" rx="2" fill="#ffffff" fillOpacity="0.3" />
          <path d="M56 66 L60 70 L68 62" fill="none" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" />
          <rect x="74" y="64" width="54" height="4" rx="2" fill="#ffffff" fillOpacity="0.3" />
          <path d="M56 86 L60 90 L68 82" fill="none" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" />
          <rect x="74" y="84" width="60" height="4" rx="2" fill="#ffffff" fillOpacity="0.3" />
          <text x="100" y="103" textAnchor="middle" fill="#67e8f9" fontSize="6.5" fontFamily="monospace">RUBRIC PASS: 100/100</text>
        </svg>
      )
    }
  ];

  return (
    <section className="w-full bg-canvas py-24 lg:py-32 border-b border-rule transition-colors duration-150" id="reassurance">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
        
        {/* Reassurance Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 sm:mb-16">
          <div className="max-w-[720px]">
            <div className="superset-eyebrow mb-3">
              <span className="w-1.5 h-1.5 rounded-none bg-ember" />
              <span>REASSURANCE &amp; SECURITY STANDARDS</span>
            </div>
            <h2 className="font-sans text-3xl sm:text-4xl lg:text-[46px] leading-[1.12] tracking-[-0.025em] text-foreground font-medium mb-4">
              Built on verified execution and rigorous academic integrity.
            </h2>
            <p className="font-sans text-base sm:text-[17px] text-muted leading-relaxed">
              Every curriculum checkpoint, student submission, and credential issuance adheres to verified production-grade standards.
            </p>
          </div>

          {/* Circular Technical Seal at Far Right */}
          <div className="shrink-0 flex items-center gap-3 p-4 border border-rule bg-wash rounded-[2px]">
            <div className="w-10 h-10 rounded-full border border-ember/40 flex items-center justify-center text-ember">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="font-mono text-left">
              <div className="text-[11px] uppercase tracking-wider text-foreground font-medium">SOC2 // VERIFIED</div>
              <div className="text-[10px] text-muted">AUDIT PASS 2026</div>
            </div>
          </div>
        </div>

        {/* Interactive Fan Deck Cards Showcase */}
        <div className="w-full py-6 flex flex-col items-center">
          <FanDeckCard 
            cards={securityCards} 
            label="Reassurance & Security Standards" 
            theme="canvas" 
          />
          <p className="font-mono text-xs text-muted/70 mt-6 text-center">
            Reach or hover to fan out the standards · Click or swipe to deal through the deck
          </p>
        </div>

      </div>
    </section>
  );
}

