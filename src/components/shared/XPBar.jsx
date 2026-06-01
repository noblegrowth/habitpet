/**
 * XPBar — a chunky, glossy progress bar showing level + progress to next level.
 * Used for both the Family Pet (collective XP) and personal pets.
 */
import { levelProgress } from "../../utils/xp.js";

export default function XPBar({ xp = 0, color = "#7DD3FC", label, compact = false }) {
  const { level, into, span, pct, isMax } = levelProgress(xp);

  return (
    <div className="w-full">
      <div className="mb-1 flex items-end justify-between">
        <span className="font-display text-sm font-bold text-ink/80">
          {label ?? `Level ${level}`}
        </span>
        {!compact && (
          <span className="font-display text-xs font-bold text-ink/50">
            {isMax ? "MAX LEVEL ✨" : `${into} / ${span} XP`}
          </span>
        )}
      </div>
      <div
        className="relative h-4 w-full overflow-hidden rounded-full bg-ink/10"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full transition-[width] duration-700 ease-out"
          style={{
            width: `${Math.max(pct, isMax ? 100 : 6)}%`,
            background: `linear-gradient(90deg, ${color}, ${color}cc)`,
          }}
        />
        {/* glossy shimmer */}
        <div
          className="pointer-events-none absolute inset-0 animate-shimmer rounded-full opacity-40"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.7) 50%, transparent 100%)",
            backgroundSize: "200% 100%",
          }}
        />
      </div>
    </div>
  );
}
