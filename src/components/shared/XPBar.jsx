/**
 * XPBar — a matte felt progress groove showing level + progress to next level.
 * Soft inset "stitched" track, flat wool fill, warm top-light. No gloss.
 */
import { levelProgress } from "../../utils/xp.js";

export default function XPBar({ xp = 0, color = "#C27457", label, compact = false }) {
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
        style={{ boxShadow: "inset 0 2px 4px rgba(74,64,54,0.22)" }}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full transition-[width] duration-700 ease-out"
          style={{
            width: `${Math.max(pct, isMax ? 100 : 6)}%`,
            backgroundColor: color,
            // soft top-light + bottom occlusion so the fill looks like packed wool
            boxShadow:
              "inset 0 3px 5px rgba(255,255,255,0.30), inset 0 -3px 5px rgba(74,64,54,0.20)",
          }}
        />
      </div>
    </div>
  );
}
