/**
 * HabitPet — streak math (pure). Grace-first (plan §pillar 4):
 * a streak stays "alive" through today even if today isn't done yet, as long as
 * yesterday was — it's only broken once a full day is missed.
 */
import { diffDays, todayKey } from "./date.js";

/**
 * @param {string[]} dateKeys  completion dates ("YYYY-MM-DD"), any order, dups ok
 * @param {string}   today
 * @returns {{ current:number, longest:number, lastCompleted:string|null, atRisk:boolean }}
 *  - current:   length of the consecutive run ending today or yesterday (else 0)
 *  - longest:   longest consecutive run anywhere in the history
 *  - atRisk:    true when the run ends yesterday (today not yet done)
 */
export function computeStreak(dateKeys, today = todayKey()) {
  if (!dateKeys || dateKeys.length === 0) {
    return { current: 0, longest: 0, lastCompleted: null, atRisk: false };
  }

  const uniq = [...new Set(dateKeys)].sort(); // ascending

  // Longest consecutive run anywhere.
  let longest = 1;
  let run = 1;
  for (let i = 1; i < uniq.length; i += 1) {
    run = diffDays(uniq[i], uniq[i - 1]) === 1 ? run + 1 : 1;
    if (run > longest) longest = run;
  }

  // Current run: must end today (gap 0) or yesterday (gap 1) to count.
  const last = uniq[uniq.length - 1];
  const gap = diffDays(today, last);
  let current = 0;
  if (gap === 0 || gap === 1) {
    current = 1;
    for (let i = uniq.length - 2; i >= 0; i -= 1) {
      if (diffDays(uniq[i + 1], uniq[i]) === 1) current += 1;
      else break;
    }
  }

  return { current, longest, lastCompleted: last, atRisk: gap === 1 };
}
