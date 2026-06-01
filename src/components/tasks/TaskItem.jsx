/**
 * TaskItem — one checkable habit row (felt style).
 * Tap the round check to toggle. Done = filled coral check + muted title.
 * Shows XP, a streak flame, bonus/kid-goal markers, and an approval hint.
 */
import { useState } from "react";

export default function TaskItem({ item, streak = 0, onToggle, accent = "#C27457" }) {
  const { task, done } = item;
  const [pop, setPop] = useState(false);

  function toggle() {
    if (!done) {
      setPop(true);
      setTimeout(() => setPop(false), 600);
    }
    onToggle?.(task, done);
  }

  const xp = Math.round((task.xpValue ?? 0) * (task.bonusMultiplier ?? 1));

  return (
    <div
      className={`flex items-center gap-3 rounded-3xl px-3 py-2 transition ${
        done ? "bg-grass-soft/40" : "felt-surface"
      }`}
    >
      <button
        type="button"
        onClick={toggle}
        aria-pressed={done}
        aria-label={done ? `Mark ${task.title} not done` : `Mark ${task.title} done`}
        className={`tap-target flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 text-2xl transition active:scale-90 ${
          pop ? "animate-felt-hop" : ""
        }`}
        style={
          done
            ? { backgroundColor: accent, borderColor: accent, color: "white" }
            : { borderColor: `${accent}88`, color: "transparent" }
        }
      >
        {done ? "✓" : ""}
      </button>

      <span className="text-2xl" aria-hidden>
        {task.icon}
      </span>

      <div className="min-w-0 flex-1">
        <div
          className={`truncate font-display font-bold ${
            done ? "text-ink/40 line-through" : "text-ink"
          }`}
        >
          {task.title}
        </div>
        <div className="flex flex-wrap items-center gap-x-2 text-xs font-bold text-ink/50">
          <span>+{xp} XP</span>
          {streak > 0 && <span className="text-coral-deep">🔥 {streak}</span>}
          {task.isKidInitiated && <span className="text-grape-deep">🚀 My Goal</span>}
          {task.isBonus && <span className="text-golden-deep">⭐ Bonus</span>}
          {task.requiresApproval && done && (
            <span className="text-ink/40">· awaiting grown-up ✓</span>
          )}
        </div>
      </div>
    </div>
  );
}
