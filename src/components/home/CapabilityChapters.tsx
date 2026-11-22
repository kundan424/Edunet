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

          {/* Media Column (Light Gradient Glass Product Window) */}
          <div className="relative flex items-center justify-center">
            {/* Ambient Pearl/White Stage Lighting */}
            <div 
              className="absolute inset-0 -m-8 pointer-events-none rounded-full blur-2xl opacity-75 dark:opacity-30"
              style={{
                background: 'radial-gradient(55% 45% at 50% 40%, rgba(255, 255, 255, 0.95), rgba(220, 232, 255, 0.55) 50%, rgba(0, 0, 0, 0) 75%)'
              }}
            />

            {/* 14px Light-Gradient Glass Product Window */}
            <div 
              className="relative z-10 w-full rounded-[14px] overflow-hidden backdrop-blur-2xl transition-transform duration-300 hover:scale-[1.01] bg-gradient-to-br from-white/95 via-[#f9fbff]/90 to-[#ecf2fc]/80 dark:bg-none dark:bg-white/[0.12] border border-white/90 dark:border-white/20 shadow-[0_22px_48px_-12px_rgba(25,35,60,0.08),_inset_0_1px_2px_rgba(255,255,255,0.95),_inset_0_-1px_1px_rgba(0,0,0,0.03)] dark:shadow-[0_20px_45px_-12px_rgba(0,0,0,0.4),_inset_0_1px_1px_rgba(255,255,255,0.25)]"
            >
              {/* Light Gradient Glass Title Bar */}
              <div className="h-10 px-4 bg-gradient-to-r from-white/95 via-[#f7faff]/90 to-white/95 dark:bg-none dark:bg-white/[0.08] border-b border-black/[0.06] dark:border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-600 dark:text-slate-300 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                  <span className="ml-2 font-medium text-slate-700 dark:text-slate-200">edunet-cli</span>
                </div>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold tracking-wide bg-emerald-500/10 dark:bg-emerald-500/20 px-2 py-0.5 rounded text-[10px]">VM_ACTIVE</span>
              </div>

              {/* Window Content */}
              <div className="p-5 font-mono text-xs space-y-3 bg-gradient-to-b from-white/30 to-[#eef3fb]/40 dark:bg-none dark:bg-black/20">
                <div className="flex items-center justify-between p-3.5 bg-gradient-to-b from-white/95 to-[#f7faff]/90 dark:bg-none dark:bg-white/[0.07] border border-black/[0.05] dark:border-white/10 rounded-[8px] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-ember/10 flex items-center justify-center shrink-0">
                      <Terminal className="w-4 h-4 text-ember" />
                    </div>
                    <div>
                      <div className="text-slate-900 dark:text-white font-sans text-xs font-semibold">Docker &amp; K8s Harness</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Dedicated 2GB RAM container</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/20 px-2.5 py-1 rounded font-semibold border border-emerald-500/20">Connected</span>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-gradient-to-b from-white/95 to-[#f7faff]/90 dark:bg-none dark:bg-white/[0.07] border border-black/[0.05] dark:border-white/10 rounded-[8px] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-slate-100 dark:bg-white/10 flex items-center justify-center shrink-0">
                      <Video className="w-4 h-4 text-slate-700 dark:text-white" />
                    </div>
                    <div>
                      <div className="text-slate-900 dark:text-white font-sans text-xs font-semibold">Modular HD Video Lessons</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Timestamped bookmarks &amp; notes</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-600 dark:text-slate-300 bg-slate-100/90 dark:bg-white/10 px-2.5 py-1 rounded font-mono border border-black/5 dark:border-white/10">1080p 60fps</span>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-gradient-to-b from-white/95 to-[#f7faff]/90 dark:bg-none dark:bg-white/[0.07] border border-black/[0.05] dark:border-white/10 rounded-[8px] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-ember/10 flex items-center justify-center shrink-0">
                      <FileCheck className="w-4 h-4 text-ember" />
                    </div>
                    <div>
                      <div className="text-slate-900 dark:text-white font-sans text-xs font-semibold">Concept Retention Quizzes</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Instant grading and feedback</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/20 px-2.5 py-1 rounded font-semibold border border-emerald-500/20">Automated</span>
                </div>

                <div className="pt-2 border-t border-black/[0.06] dark:border-white/10 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono px-1">
                  <span>Latency: 12ms</span>
                  <span>TLS 1.3 Verified</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* =========================================================================
            Chapter 2: Accredited Credentials & Transcripts
            Product Window on Left, Text on Right (Alternating!)
           ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Media Column (Light Gradient Glass Product Window on Left) */}
          <div className="relative order-2 lg:order-1 flex items-center justify-center">
            {/* Ambient Pearl/White Stage Lighting */}
            <div 
              className="absolute inset-0 -m-8 pointer-events-none rounded-full blur-2xl opacity-75 dark:opacity-30"
              style={{
                background: 'radial-gradient(55% 45% at 50% 40%, rgba(255, 255, 255, 0.95), rgba(220, 232, 255, 0.55) 50%, rgba(0, 0, 0, 0) 75%)'
              }}
            />

            {/* 14px Light-Gradient Glass Product Window */}
            <div 
              className="relative z-10 w-full rounded-[14px] overflow-hidden backdrop-blur-2xl transition-transform duration-300 hover:scale-[1.01] bg-gradient-to-br from-white/95 via-[#f9fbff]/90 to-[#ecf2fc]/80 dark:bg-none dark:bg-white/[0.12] border border-white/90 dark:border-white/20 shadow-[0_22px_48px_-12px_rgba(25,35,60,0.08),_inset_0_1px_2px_rgba(255,255,255,0.95),_inset_0_-1px_1px_rgba(0,0,0,0.03)] dark:shadow-[0_20px_45px_-12px_rgba(0,0,0,0.4),_inset_0_1px_1px_rgba(255,255,255,0.25)]"
            >
              {/* Light Gradient Glass Title Bar */}
              <div className="h-10 px-4 bg-gradient-to-r from-white/95 via-[#f7faff]/90 to-white/95 dark:bg-none dark:bg-white/[0.08] border-b border-black/[0.06] dark:border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-600 dark:text-slate-300 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                  <span className="ml-2 font-medium text-slate-700 dark:text-slate-200">credential-verifier</span>
                </div>
                <span className="text-ember font-semibold tracking-wide bg-ember/10 px-2 py-0.5 rounded text-[10px]">VERIFIED</span>
              </div>

              {/* Certificate Verification Mockup */}
              <div className="p-5 font-mono text-xs space-y-3 bg-gradient-to-b from-white/30 to-[#eef3fb]/40 dark:bg-none dark:bg-black/20">
                <div className="p-4 bg-gradient-to-b from-white/95 to-[#f7faff]/90 dark:bg-none dark:bg-white/[0.07] border border-black/[0.05] dark:border-white/10 rounded-[8px] space-y-2 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-white/50">
                    <span className="font-semibold tracking-wider">CREDENTIAL ID</span>
                    <span className="text-ember font-mono font-semibold">EDN-9428-DIST</span>
                  </div>
                  <div className="font-sans text-base font-semibold text-slate-900 dark:text-white">
                    Full-Stack Architecture Specialization
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
                    Issued with distinction to Alex Morgan. Cryptographically audited against course quiz evaluations and assignment capstone criteria.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-3 bg-gradient-to-b from-white/95 to-[#f7faff]/90 dark:bg-none dark:bg-white/[0.07] border border-black/[0.05] dark:border-white/10 rounded-[8px]">
                    <span className="text-slate-500 dark:text-white/50 block text-[10px] font-semibold">ISSUER</span>
                    <span className="text-slate-900 dark:text-white font-sans font-medium">Faculty Board</span>
                  </div>
                  <div className="p-3 bg-gradient-to-b from-white/95 to-[#f7faff]/90 dark:bg-none dark:bg-white/[0.07] border border-black/[0.05] dark:border-white/10 rounded-[8px]">
                    <span className="text-slate-500 dark:text-white/50 block text-[10px] font-semibold">ACCREDITATION</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">ECTS Compatible</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-black/[0.06] dark:border-white/10 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono px-1">
                  <span className="flex items-center gap-1.5 text-slate-700 dark:text-white/80">
                    <CheckCircle2 className="w-3.5 h-3.5 text-ember" />
                    Public Verification URL
                  </span>
                  <span>Shareable to LinkedIn</span>
                </div>
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
