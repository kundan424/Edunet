"use client";

import {
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";

/**
 * Fan Deck
 * A stack of cards that behaves like a hand of them. Rest, and it's a tidy
 * pile with the top card showing. Reach for it and the cards fan out in an
 * arc so you can see them all; the one you're over lifts. Pick one and it
 * comes up out of the hand and tucks in on top, while the old top card
 * slides to the back. Swipe or use the arrow keys to deal through them.
 */

export type DeckCard = {
  id: string;
  title: string;
  meta: string;
  blurb: string;
  art: ReactNode;
  tint: string;
};

type Props = {
  cards: DeckCard[];
  label?: string;
  theme?: "paper" | "night" | "canvas";
  motion?: "full" | "reduced";
  className?: string;
};

export function FanDeckCard({
  cards,
  label = "Reassurance & Security Standards",
  theme = "canvas",
  motion = "full",
  className = "",
}: Props) {
  const [order, setOrder] = useState(cards.map((c) => c.id)); // order[0] is on top
  const [open, setOpen] = useState(false);
  const [over, setOver] = useState<string | null>(null);
  const [lifting, setLifting] = useState<string | null>(null);
  const swipe = useRef<{ x: number; t: number } | null>(null);
  const timers = useRef<number[]>([]);
  const byId = new Map(cards.map((c) => [c.id, c]));
  const n = cards.length;

  const reduced = () =>
    motion === "reduced" ||
    (typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  /** Bring a card to the top: it lifts clear of the hand first, then tucks in. */
  const toTop = (id: string) => {
    if (order[0] === id || lifting) return;
    if (reduced()) {
      setOrder((o) => [id, ...o.filter((x) => x !== id)]);
      return;
    }
    setLifting(id);
    timers.current.push(
      window.setTimeout(
        () => setOrder((o) => [id, ...o.filter((x) => x !== id)]),
        230,
      ),
    );
    timers.current.push(window.setTimeout(() => setLifting(null), 560));
  };

  const deal = (dir: 1 | -1) => toTop(dir === 1 ? order[1] : order[n - 1]);

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      deal(1);
    }
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      deal(-1);
    }
  };

  return (
    <section
      className={`fd fd--${theme} ${className}`}
      data-motion={motion}
      data-open={open || undefined}
      aria-label={label}
      onPointerEnter={(e) => {
        if (e.pointerType !== "touch") setOpen(true);
      }}
      onPointerLeave={() => {
        setOpen(false);
        setOver(null);
      }}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
      onKeyDown={onKey}
    >
      <style>{`
        .fd {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          min-height: 480px;
          user-select: none;
          touch-action: pan-y;
        }

        .fd__hand {
          position: relative;
          width: 320px;
          height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 1200px;
        }

        @media (min-width: 640px) {
          .fd__hand {
            width: 360px;
            height: 420px;
          }
        }

        .fd__card {
          position: absolute;
          width: 290px;
          height: 380px;
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          text-align: left;
          background-color: var(--color-card, #1c1c1e);
          color: var(--color-foreground, #ededed);
          border: 1px solid var(--color-rule, rgba(255, 255, 255, 0.1));
          box-shadow: 
            0 4px 6px -1px rgba(0, 0, 0, 0.15),
            0 20px 30px -10px rgba(0, 0, 0, 0.35);
          transition: transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1),
                      box-shadow 0.3s ease,
                      border-color 0.2s ease;
          transform-origin: 50% 120%;
          display: flex;
          flex-direction: column;
          outline: none;
        }

        @media (min-width: 640px) {
          .fd__card {
            width: 320px;
            height: 400px;
          }
        }

        /* At Rest (Stacked) */
        .fd:not([data-open]) .fd__card {
          transform: translateY(calc(var(--i) * 3px)) rotate(var(--r));
        }

        /* Fanned Out on Hover */
        .fd[data-open] .fd__card {
          transform: 
            translateX(calc(var(--f) * 200px)) 
            translateY(calc(max(var(--f), -1 * var(--f)) * 32px - 6px)) 
            rotate(calc(var(--f) * 20deg));
        }

        @media (min-width: 640px) {
          .fd[data-open] .fd__card {
            transform: 
              translateX(calc(var(--f) * 260px)) 
              translateY(calc(max(var(--f), -1 * var(--f)) * 40px - 8px)) 
              rotate(calc(var(--f) * 24deg));
          }
        }

        /* Hovered Card Lift */
        .fd[data-open] .fd__card[data-over] {
          transform: 
            translateX(calc(var(--f) * 200px)) 
            translateY(calc(max(var(--f), -1 * var(--f)) * 32px - 34px)) 
            rotate(calc(var(--f) * 20deg))
            scale(1.02);
          border-color: var(--tint, #d25611);
          box-shadow: 
            0 10px 20px -3px rgba(0, 0, 0, 0.25),
            0 28px 45px -12px rgba(0, 0, 0, 0.5);
          z-index: 90 !important;
        }

        @media (min-width: 640px) {
          .fd[data-open] .fd__card[data-over] {
            transform: 
              translateX(calc(var(--f) * 260px)) 
              translateY(calc(max(var(--f), -1 * var(--f)) * 40px - 40px)) 
              rotate(calc(var(--f) * 24deg))
              scale(1.03);
          }
        }

        /* Lifting Transition to Top */
        .fd__card[data-lift] {
          transform: translateX(0) translateY(-90px) rotate(0deg) scale(1.06) !important;
          z-index: 100 !important;
          border-color: var(--tint, #d25611);
          box-shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.6) !important;
        }

        .fd__art {
          width: 100%;
          height: 160px;
          position: relative;
          overflow: hidden;
          background: #111113;
          border-bottom: 1px solid var(--color-rule, rgba(255, 255, 255, 0.08));
          flex-shrink: 0;
        }

        @media (min-width: 640px) {
          .fd__art {
            height: 180px;
          }
        }

        .fd__body {
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex-grow: 1;
        }

        .fd__meta {
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 10px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--tint, var(--color-ember, #d25611));
          font-weight: 500;
        }

        .fd__title {
          font-family: var(--font-sans, -apple-system, sans-serif);
          font-size: 16px;
          font-weight: 600;
          color: var(--color-foreground, #ededed);
          letter-spacing: -0.02em;
          line-height: 1.25;
        }

        .fd__blurb {
          font-family: var(--font-sans, -apple-system, sans-serif);
          font-size: 13px;
          color: var(--color-muted, #888888);
          line-height: 1.55;
          margin-top: 2px;
        }

        .fd__ctl {
          margin-top: 28px;
          display: flex;
          align-items: center;
          gap: 16px;
          font-family: var(--font-mono, monospace);
          font-size: 12px;
          color: var(--color-muted, #888888);
        }

        .fd__ctl button {
          width: 32px;
          height: 32px;
          border-radius: 9999px;
          border: 1px solid var(--color-rule, rgba(255, 255, 255, 0.15));
          background: var(--color-wash, rgba(255, 255, 255, 0.04));
          color: var(--color-foreground, #ededed);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .fd__ctl button:hover {
          background: var(--color-rule, rgba(255, 255, 255, 0.1));
          border-color: var(--color-foreground, #ffffff);
        }

        @media (prefers-reduced-motion: reduce) {
          .fd__card {
            transition: none !important;
          }
        }
      `}</style>

      <div
        className="fd__hand"
        onPointerDown={(e) => {
          swipe.current = { x: e.clientX, t: e.timeStamp };
        }}
        onPointerUp={(e) => {
          const s = swipe.current;
          swipe.current = null;
          if (!s) return;
          const dx = e.clientX - s.x;
          if (Math.abs(dx) > 40 && e.timeStamp - s.t < 600)
            deal(dx < 0 ? 1 : -1);
        }}
      >
        {cards.map((c) => {
          const i = order.indexOf(c.id);
          const f = n > 1 ? 0.5 - i / (n - 1) : 0;
          const lift = lifting === c.id;
          const style = {
            ["--i" as string]: i,
            ["--f" as string]: f,
            ["--r" as string]: `${(i % 2 ? -1 : 1) * i * 1.5}deg`,
            zIndex: lift ? 100 : n - i,
          } as CSSProperties;
          const top = i === 0;

          return (
            <button
              key={c.id}
              type="button"
              className="fd__card"
              data-top={top || undefined}
              data-over={over === c.id || undefined}
              data-lift={lift || undefined}
              style={{ ...style, ["--tint" as string]: c.tint }}
              onPointerEnter={() => setOver(c.id)}
              onPointerLeave={() => setOver((o) => (o === c.id ? null : o))}
              onClick={() => toTop(c.id)}
              aria-current={top || undefined}
              aria-label={
                top
                  ? `${c.title}, ${c.meta}. On top.`
                  : `Bring ${c.title} to the top`
              }
              tabIndex={top ? 0 : -1}
            >
              <div className="fd__art" aria-hidden="true">
                {c.art}
              </div>
              <div className="fd__body">
                <span className="fd__meta">{c.meta}</span>
                <span className="fd__title">{c.title}</span>
                <span className="fd__blurb">{c.blurb}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="fd__ctl">
        <button
          type="button"
          onClick={() => deal(-1)}
          aria-label="Previous card"
        >
          ←
        </button>
        <span aria-live="polite">
          {byId.get(order[0])?.title} ·{" "}
          {cards.findIndex((c) => c.id === order[0]) + 1} of {n}
        </span>
        <button type="button" onClick={() => deal(1)} aria-label="Next card">
          →
        </button>
      </div>
    </section>
  );
}

export default FanDeckCard;
