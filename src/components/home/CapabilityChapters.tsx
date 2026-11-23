import { Link } from 'react-router-dom';
import { CheckCircle2, Video, FileCheck, Terminal, ArrowRight } from 'lucide-react';

export function CapabilityChapters() {
  return (
    <section className="w-full bg-canvas py-24 lg:py-32 border-b border-rule transition-colors duration-150" id="capabilities">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 space-y-28 lg:space-y-32">
        
        {/* =========================================================================
            Chapter 1: Interactive MicroVM Sandboxes & HD Lessons
            Text on Left, Product Window on Right
           ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Text Column (500px max measure) */}
          <div className="flex flex-col items-start max-w-[500px]">
            <div className="superset-eyebrow mb-3">
              <span className="w-1.5 h-1.5 rounded-none bg-ember" />
              <span>CAPABILITY 01</span>
            </div>

            <h2 className="font-sans text-3xl sm:text-[34px] leading-[1.2] tracking-[-0.025em] text-foreground font-medium mb-5">
              Switch modules. Keep your worktree.
            </h2>

            <p className="font-sans text-[17px] leading-[1.625] text-muted mb-8">
              Each student executes inside their own isolated microVM worktree. Pre-installed toolchains, automated concept quizzes, and low-latency terminal interactions keep your focus entirely on coding craft.
            </p>

            <Link
              to="/courses"
              className="btn-superset-primary"
            >
              <span>Explore Interactive Courses</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Media Column (Domain Hub Themed Capability Card) */}
          <div className="relative flex items-center justify-center">
            {/* Embedded Capability Card with 3 dots on top */}
            <div className="relative z-10 w-full max-w-[440px] rounded-[16px] p-4.5 sm:p-5 bg-card border border-rule transition-colors">
              
              {/* Top Bar with 3 Window Dots */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-rule">
                <div className="flex items-center gap-2.5">
                  {/* 3 dots on top */}
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                  </div>
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-muted-surface border border-rule font-mono text-[10px] font-semibold text-foreground tracking-wider">
                    <span>edunet-cli</span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-muted-surface border border-rule font-mono text-[10px] font-semibold text-foreground tracking-wider">
                  VM_ACTIVE
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="font-sans text-lg sm:text-xl font-bold tracking-tight text-foreground mb-1.5">
                Interactive MicroVM Sandbox
              </h3>
              <p className="font-sans text-xs sm:text-[13px] leading-relaxed text-muted mb-3">
                Dedicated container runtimes with pre-installed toolchains, automated quizzes, and low-latency terminal interactions.
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-3.5">
                {['DOCKER', 'KUBERNETES', 'MICROVM', 'TERMINAL'].map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-full bg-muted-surface border border-rule font-mono text-[10px] font-medium text-muted uppercase tracking-wider"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Inner Specifications Card (Initial Capability Items) */}
              <div className="rounded-[12px] border border-rule bg-muted-surface/30 p-3 sm:p-3.5 mb-3.5">
                <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-rule font-mono text-[10px] uppercase tracking-wider">
                  <div className="flex items-center gap-2 text-muted font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
                    <span>RUNTIME SPECIFICATIONS (3)</span>
                  </div>
                  <span className="font-bold text-foreground">CONNECTED</span>
                </div>

                <div className="space-y-2 font-mono">
                  {/* Item 1 */}
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded bg-muted-surface flex items-center justify-center shrink-0 border border-rule">
                        <Terminal className="w-3 h-3 text-foreground" />
                      </div>
                      <div className="truncate">
                        <span className="text-foreground font-medium">Docker &amp; K8s Harness</span>
                        <span className="text-muted text-[10px] block sm:inline sm:ml-2">2GB Dedicated RAM</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-foreground shrink-0 font-medium bg-muted-surface px-2 py-0.5 rounded border border-rule">
                      Connected
                    </span>
                  </div>

                  {/* Item 2 */}
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded bg-muted-surface flex items-center justify-center shrink-0 border border-rule">
                        <Video className="w-3 h-3 text-foreground" />
                      </div>
                      <div className="truncate">
                        <span className="text-foreground font-medium">Modular HD Lessons</span>
                        <span className="text-muted text-[10px] block sm:inline sm:ml-2">Bookmarks &amp; Notes</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-muted shrink-0 bg-muted-surface px-2 py-0.5 rounded border border-rule">
                      1080p 60fps
                    </span>
                  </div>

                  {/* Item 3 */}
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded bg-muted-surface flex items-center justify-center shrink-0 border border-rule">
                        <FileCheck className="w-3 h-3 text-foreground" />
                      </div>
                      <div className="truncate">
                        <span className="text-foreground font-medium">Retention Quizzes</span>
                        <span className="text-muted text-[10px] block sm:inline sm:ml-2">Instant Grading</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-foreground shrink-0 font-medium bg-muted-surface px-2 py-0.5 rounded border border-rule">
                      Automated
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer Row */}
              <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-muted">
                <span>Latency: 12ms</span>
                <span>TLS 1.3 Verified</span>
              </div>

            </div>
          </div>

        </div>

        {/* =========================================================================
            Chapter 2: Accredited Credentials & Transcripts
            Product Window on Left, Text on Right (Alternating!)
           ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Media Column (Domain Hub Themed Capability Card - Credential Verifier) */}
          <div className="relative order-2 lg:order-1 flex items-center justify-center">
            {/* Embedded Capability Card with 3 dots on top */}
            <div className="relative z-10 w-full max-w-[440px] rounded-[16px] p-4.5 sm:p-5 bg-card border border-rule transition-colors">
              
              {/* Top Bar with 3 Window Dots */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-rule">
                <div className="flex items-center gap-2.5">
                  {/* 3 dots on top */}
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                  </div>
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-muted-surface border border-rule font-mono text-[10px] font-semibold text-foreground tracking-wider">
                    <span>credential-verifier</span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-muted-surface border border-rule font-mono text-[10px] font-semibold text-foreground tracking-wider">
                  VERIFIED
                </span>
              </div>

              {/* Title & Description */}
              <div className="flex items-center justify-between text-[10px] font-mono text-muted mb-1 font-semibold tracking-wider">
                <span>CREDENTIAL ID</span>
                <span className="text-foreground font-mono font-semibold">EDN-9428-DIST</span>
              </div>
              <h3 className="font-sans text-lg sm:text-xl font-bold tracking-tight text-foreground mb-1.5">
                Full-Stack Architecture Specialization
              </h3>
              <p className="font-sans text-xs sm:text-[13px] leading-relaxed text-muted mb-3">
                Issued with distinction to Alex Morgan. Cryptographically audited against course quiz evaluations and assignment capstone criteria.
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-3.5">
                {['ARCHITECTURE', 'CAPSTONE', 'ACCREDITED', 'ECTS-COMPATIBLE'].map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-full bg-muted-surface border border-rule font-mono text-[10px] font-medium text-muted uppercase tracking-wider"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Inner Verification Details Card */}
              <div className="rounded-[12px] border border-rule bg-muted-surface/30 p-3 sm:p-3.5 mb-3.5">
                <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-rule font-mono text-[10px] uppercase tracking-wider">
                  <div className="flex items-center gap-2 text-muted font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
                    <span>VERIFICATION RECORD (2)</span>
                  </div>
                  <span className="font-bold text-foreground">AUDITED</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="p-2.5 bg-card border border-rule rounded-[6px]">
                    <span className="text-muted block text-[10px] font-semibold uppercase tracking-wider">ISSUER</span>
                    <span className="text-foreground font-sans font-medium text-xs mt-0.5 block">Faculty Board</span>
                  </div>
                  <div className="p-2.5 bg-card border border-rule rounded-[6px]">
                    <span className="text-muted block text-[10px] font-semibold uppercase tracking-wider">ACCREDITATION</span>
                    <span className="text-foreground font-semibold text-xs mt-0.5 block">ECTS Compatible</span>
                  </div>
                </div>
              </div>

              {/* Footer Row */}
              <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-muted">
                <span className="flex items-center gap-1.5 text-foreground font-sans">
                  <CheckCircle2 className="w-3.5 h-3.5 text-foreground" />
                  Public Verification URL
                </span>
                <span>Shareable to LinkedIn</span>
              </div>

            </div>
          </div>

          {/* Text Column (500px max measure) */}
          <div className="flex flex-col items-start max-w-[500px] order-1 lg:order-2">
            <div className="superset-eyebrow mb-3">
              <span className="w-1.5 h-1.5 rounded-none bg-ember" />
              <span>ACCREDITED CREDENTIALS</span>
            </div>

            <h2 className="font-sans text-3xl sm:text-[34px] leading-[1.2] tracking-[-0.025em] text-foreground font-medium mb-5">
              Proof that outlives the course.
            </h2>

            <p className="font-sans text-[17px] leading-[1.625] text-muted mb-8">
              Celebrate completed course tracks with verifiable digital credentials. Each certificate includes immutable credential IDs and public verification links that prospective employers can instantly inspect.
            </p>

            <Link
              to="/courses?search=Certificate"
              className="btn-superset-secondary"
            >
              <span>Explore Certificate Programs</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
