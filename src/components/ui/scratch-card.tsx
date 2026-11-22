import * as React from "react";
import { Copy, Check } from "lucide-react";

export interface ScratchCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "onCopy"> {
  /** The big value or title printed on the card, e.g. "$50" or "VERIFIED". */
  amount?: string;
  /** First brand line, top left of the card (bold). */
  brand?: string;
  /** Second brand line under the brand name (lighter). */
  tagline?: string;
  /** One line of small print above the panel. */
  note?: string;
  /** The code or identifier shown in the card panel. */
  code?: string;
  /** Line under the card once the code is shown. */
  readyHint?: string;
  /** Visible text on the copy button. */
  copyLabel?: string;
  /** Visible text on the copy button after a copy. */
  copiedLabel?: string;
  /** Called with the code after the copy button wrote it to the clipboard. */
  onCopy?: (code: string) => void;
  /** Card colour. */
  color?: string;
  /** Text and mark colour on the card. */
  ink?: string;
  /** Colour of the strip that carries the code. */
  paper?: string;
  /** Dark colour for the code, the hint text and the copy button. */
  textColor?: string;
  /** Copy button colour after a successful copy. */
  success?: string;
  /** Largest card width in px. */
  cardWidth?: number;
}

export function ScratchCard({
  amount = "$50",
  brand = "Edunet",
  tagline = "Engineering Credentials",
  note = "Verified course credit. Valid across all accredited tracks.",
  code = "EDN-9428-DIST",
  readyHint = "Your verified credential code is ready.",
  copyLabel = "Copy code",
  copiedLabel = "Copied",
  onCopy,
  color = "#161618",
  ink = "#fafafa",
  paper = "#1e1e22",
  textColor = "#fafafa",
  success = "#22c55e",
  cardWidth = 596,
  className = "",
  style,
  ...rest
}: ScratchCardProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      onCopy?.(code);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback copy
      const ta = document.createElement("textarea");
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      onCopy?.(code);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className={`relative w-full max-w-[${cardWidth}px] select-none ${className}`}
      style={{
        maxWidth: cardWidth,
        ...style,
      }}
      {...rest}
    >
      {/* Premium Tactile Card Body */}
      <div
        className="relative w-full rounded-[15px] p-7 transition-all duration-300"
        style={{
          background: color,
          color: ink,
          boxShadow: `
            inset 0 1px 0 rgba(255, 255, 255, 0.15),
            inset 0 0 0 1px rgba(255, 255, 255, 0.08),
            0 4px 6px -1px rgba(0, 0, 0, 0.3),
            0 20px 35px -10px rgba(0, 0, 0, 0.45)
          `,
        }}
      >
        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="font-sans font-semibold text-lg tracking-tight leading-tight">
              {brand}
            </div>
            <div className="font-mono text-xs opacity-60 mt-0.5">
              {tagline}
            </div>
          </div>

          {/* Watermark Logo Icon */}
          <div className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-ember">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
        </div>

        {/* Big Amount / Main Headline */}
        {amount && (
          <div className="font-sans font-bold text-5xl sm:text-6xl tracking-tight mb-4">
            {amount}
          </div>
        )}

        {/* Small Note */}
        {note && (
          <p className="font-sans text-xs opacity-70 leading-relaxed mb-6 max-w-[90%]">
            {note}
          </p>
        )}

        {/* Pre-Revealed Code Strip Panel (Non-Scratchable per instructions) */}
        <div
          className="relative w-full rounded-[9px] p-4 flex items-center justify-between border border-white/10 overflow-hidden"
          style={{ background: paper }}
        >
          <div className="flex flex-col">
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted mb-0.5">
              Credential ID
            </span>
            <span className="font-mono font-semibold text-base sm:text-lg tracking-wider text-foreground">
              {code}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer"
            style={{
              background: copied ? success : textColor,
              color: copied ? "#ffffff" : "#111111",
            }}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{copiedLabel}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>{copyLabel}</span>
              </>
            )}
          </button>
        </div>

        {/* Hint Footer */}
        {readyHint && (
          <div className="mt-4 text-center font-mono text-[11px] opacity-60">
            {readyHint}
          </div>
        )}
      </div>
    </div>
  );
}

export default ScratchCard;
