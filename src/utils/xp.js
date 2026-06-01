/**
 * HabitPet — XP, Levels & Mood (pure functions)
 *
 * Pets level 1 → 50. Progress is permanent (plan §7: "Kids never lose levels").
 * Curve is gentle-but-accelerating so early levels feel quick and later ones
 * feel earned. Cumulative XP required to *reach* a level:
 *
 *   xpForLevel(L) = 25 * (L - 1) * L      // L1=0, L2=50, L3=150, L4=300 ...
 */

export const MAX_LEVEL = 50;

/** Total XP required to reach the start of `level`. */
export function xpForLevel(level) {
  const l = Math.max(1, Math.min(Math.floor(level), MAX_LEVEL));
  return 25 * (l - 1) * l;
}

/** The level a pet is at for a given total XP. */
export function levelForXp(xp) {
  const x = Math.max(0, Number(xp) || 0);
  let level = 1;
  while (level < MAX_LEVEL && xpForLevel(level + 1) <= x) {
    level += 1;
  }
  return level;
}

/**
 * Progress within the current level.
 * Returns { level, into, span, pct, nextLevelXp, isMax }.
 *  - into:        XP earned past the current level's floor
 *  - span:        XP between this level and the next
 *  - pct:         0–100 progress toward next level
 *  - nextLevelXp: total XP needed to hit the next level (null at max)
 */
export function levelProgress(xp) {
  const x = Math.max(0, Number(xp) || 0);
  const level = levelForXp(x);

  if (level >= MAX_LEVEL) {
    return { level: MAX_LEVEL, into: 0, span: 0, pct: 100, nextLevelXp: null, isMax: true };
  }

  const floor = xpForLevel(level);
  const ceil = xpForLevel(level + 1);
  const into = x - floor;
  const span = ceil - floor;
  const pct = span === 0 ? 0 : Math.round((into / span) * 100);

  return { level, into, span, pct, nextLevelXp: ceil, isMax: false };
}

// ─────────────────────────────────────────────
// MOOD (reflective, never punitive — plan §5)
// ─────────────────────────────────────────────

export const MOOD_ORDER = ["struggling", "tired", "okay", "happy", "thriving"];

/** Map a weekly completion percentage (0–100) to a pet mood. */
export function moodForCompletion(pct) {
  const p = Math.max(0, Math.min(100, Number(pct) || 0));
  if (p >= 80) return "thriving";
  if (p >= 60) return "happy";
  if (p >= 40) return "okay";
  if (p >= 20) return "tired";
  return "struggling";
}
