/**
 * KidGoalModal — tap intake for a kid-initiated goal (plan §pillar 2).
 * Celebrates initiative; creates a 1.5× bonus task pending parent review.
 * Voice intake is stubbed until the AI coach lands in Phase 3.
 */
import { useState } from "react";
import Button from "../shared/Button.jsx";

const FREQUENCIES = [
  { id: "daily", label: "Every day" },
  { id: "weekday", label: "School days" },
  { id: "weekly", label: "Once a week" },
];

export default function KidGoalModal({ onCreate, onCancel }) {
  const [title, setTitle] = useState("");
  const [frequency, setFrequency] = useState("daily");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-5 backdrop-blur-sm">
      <div className="w-full max-w-md animate-pop-in rounded-5xl bg-cream p-6 shadow-soft">
        <div className="text-center">
          <div className="text-5xl">🚀</div>
          <h2 className="mt-2 font-display text-2xl font-extrabold text-ink">
            Set your own goal!
          </h2>
          <p className="mt-1 text-sm text-ink/60">
            Goals you pick yourself are worth extra XP. A grown-up will cheer it on too.
          </p>
        </div>

        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Practice piano for 15 min"
          maxLength={60}
          className="mt-5 w-full rounded-3xl border-4 border-paper bg-white px-5 py-3 font-display text-lg font-bold text-ink shadow-soft outline-none focus:border-grape-deep"
        />

        <p className="mt-4 font-display font-bold text-ink/60">How often?</p>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {FREQUENCIES.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFrequency(f.id)}
              aria-pressed={frequency === f.id}
              className={`tap-target rounded-2xl border-4 px-2 py-2 text-sm font-bold transition active:scale-95 ${
                frequency === f.id
                  ? "border-grape-deep bg-grape-soft/50 text-ink"
                  : "border-transparent felt-surface text-ink/70"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Voice intake stub — arrives with the AI coach in Phase 3. */}
        <p className="mt-4 text-center text-xs text-ink/40">🎤 Voice goals coming soon</p>

        <div className="mt-5 flex justify-center gap-3">
          <Button variant="ghost" size="md" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            disabled={!title.trim()}
            onClick={() => onCreate?.({ title, frequency })}
          >
            Create goal 🚀
          </Button>
        </div>
      </div>
    </div>
  );
}
