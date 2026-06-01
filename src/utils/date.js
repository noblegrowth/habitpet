/**
 * HabitPet — date helpers (pure).
 *
 * "Today" is the device's LOCAL date as a `YYYY-MM-DD` key. The family tablet
 * is single-timezone in Phase 1, so local date is the simplest correct basis
 * for daily tasks and streaks. (See docs/DECISIONS.md.)
 */

/** Local date → "YYYY-MM-DD". */
export function todayKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** "YYYY-MM-DD" → local Date at midnight. */
export function parseKey(key) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Shift a key by n days (n may be negative). */
export function addDays(key, n) {
  const dt = parseKey(key);
  dt.setDate(dt.getDate() + n);
  return todayKey(dt);
}

/** Whole-day difference a − b (positive when a is later). */
export function diffDays(a, b) {
  const ms = parseKey(a).getTime() - parseKey(b).getTime();
  return Math.round(ms / 86_400_000);
}

/** 0 = Sunday … 6 = Saturday. */
export function dayOfWeek(key) {
  return parseKey(key).getDay();
}

/** Monday–Friday. */
export function isWeekday(key) {
  const d = dayOfWeek(key);
  return d >= 1 && d <= 5;
}

const WEEKDAY_LABELS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** Friendly day name, e.g. "Monday". */
export function dayName(key) {
  return WEEKDAY_LABELS[dayOfWeek(key)];
}

/** Minutes since midnight for "HH:MM". */
export function timeToMinutes(hhmm) {
  const [h, m] = String(hhmm).split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}
