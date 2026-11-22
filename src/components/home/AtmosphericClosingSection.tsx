import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, ArrowRight } from 'lucide-react';


export function AtmosphericClosingSection() {
  const [activeTab, setActiveTab] = useState<'npm' | 'curl' | 'docker'>('curl');
  const [copied, setCopied] = useState(false);

  const commands = {
    curl: 'curl -fsSL https://edunet.sh/install | bash',
    npm: 'npm install -g @edunet/sandbox-cli',
    docker: 'docker run -it --rm -p 3000:3000 edunet/runtime'
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(commands[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative w-full py-28 lg:py-32 bg-canvas text-foreground border-b border-rule flex flex-col items-center justify-center overflow-hidden transition-colors duration-150">
      
      {/* Subtle Warm Stage Radial Glow in Background */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full pointer-events-none select-none opacity-40"
        style={{
          background: 'radial-gradient(circle, rgba(232,128,74,0.08) 0%, transparent 70%)'
        }}
      />

      <div className="relative z-10 max-w-[880px] mx-auto px-4 sm:px-8 text-center flex flex-col items-center">
        
        {/* Subtle Eyebrow */}
        <div className="superset-eyebrow mb-6">
          <span className="w-1.5 h-1.5 rounded-none bg-ember" />
          <span>START LEARNING TODAY</span>
        </div>

        {/* 48px Centered Statement: Inter 500 · 48px/1.1 · tracking -0.025em */}
        <h2 className="font-sans text-3xl sm:text-5xl lg:text-[48px] leading-[1.1] tracking-[-0.025em] text-foreground font-medium mb-6 max-w-2xl">
          Ready to put computing craft to work?
        </h2>

        {/* Subtitle */}
        <p className="font-sans text-[17px] leading-[1.625] text-muted max-w-xl mb-8">
          Join over 140,000 engineers and researchers. Access verified sandboxes, modular courses, and accredited milestones on your terms.
        </p>

        {/* 32px Gap to Action Row */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
          <Link
            to="/courses"
            className="btn-superset-primary shadow-lg"
          >
            <span>Explore All Curriculums</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/register"
            className="btn-superset-secondary"
          >
            <span>Create Free Account</span>
          </Link>
        </div>

        {/* Short Practical Support Line */}
        <p className="font-mono text-xs uppercase tracking-wider text-muted mb-4">
          Or initialize our local terminal sandbox CLI:
        </p>

        {/* 
          Utility Panel:
          max-width 576px, 2px radius, low wash panel, 1px border.
          33px tab header with compact mono options and a copy glyph.
          Selected tab has 1px orange underline.
          Command row beneath uses 14px 16px padding.
        */}
        <div className="w-full superset-utility-panel shadow-2xl">
          
          {/* 33px Tab Header */}
          <div className="h-[33px] px-3 bg-muted-surface border-b border-rule flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-4 h-full">
              <button
                type="button"
                onClick={() => setActiveTab('curl')}
                className={`h-full flex items-center px-1 text-[12px] font-mono transition-colors relative cursor-pointer ${
                  activeTab === 'curl' 
                    ? 'text-foreground' 
                    : 'text-muted hover:text-foreground'
                }`}
              >
                curl
                {activeTab === 'curl' && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-ember" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('npm')}
                className={`h-full flex items-center px-1 text-[12px] font-mono transition-colors relative cursor-pointer ${
                  activeTab === 'npm' 
                    ? 'text-foreground' 
                    : 'text-muted hover:text-foreground'
                }`}
              >
                npm
                {activeTab === 'npm' && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-ember" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('docker')}
                className={`h-full flex items-center px-1 text-[12px] font-mono transition-colors relative cursor-pointer ${
                  activeTab === 'docker' 
                    ? 'text-foreground' 
                    : 'text-muted hover:text-foreground'
                }`}
              >
                docker
                {activeTab === 'docker' && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-ember" />
                )}
              </button>
            </div>

            {/* Copy Button */}
            <button
              type="button"
              onClick={handleCopy}
              className="p-1 text-muted hover:text-foreground transition-colors cursor-pointer flex items-center gap-1.5"
              title="Copy snippet"
            >
              {copied ? (
                <span className="text-[10px] text-ember uppercase">Copied!</span>
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* Command Row: 14px 16px padding */}
          <div className="px-4 py-3.5 flex items-center justify-between bg-card text-foreground font-mono text-[13px] overflow-x-auto">
            <code className="text-foreground">
              {commands[activeTab]}
            </code>
          </div>

        </div>

      </div>
    </section>
  );
}
