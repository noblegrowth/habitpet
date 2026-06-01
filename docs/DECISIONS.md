# Decisions Log

Autonomous calls made while the owner was away. One line each, with rationale.
Newest at top.

## 2026-06-01 — Session: finish felted skin + Phase 2

- **Task engine data model:** daily tasks are derived per-day from a child's
  active `tasks` records + a `taskCompletions` log keyed by local date — no
  pre-generated per-day rows. Rationale: matches the Supabase schema (tasks +
  task_completions), avoids a cron/rollover job, and keeps "miss a day" graceful
  (no orphan rows). Streaks computed from the completion log.
- **"Today" = device local date (YYYY-MM-DD).** Rationale: family tablet is
  single-timezone; simplest correct behavior. Timezone field stays on family for
  Phase 6.
- **Check-in windows are display groupings, not hard locks.** A task can be
  completed any time; its window(s) just decide which section it appears under
  and drive AI nudge timing later. Rationale: grace-first (CLAUDE.md rule 7) —
  never block a kid from checking something off.
- **XP awarded = age-bracket value × bonus multiplier, rounded.** Pulled from
  template `defaultXP[ageBracket]`. Custom/kid tasks use stored `xpValue`.
- **Finished felted skin** by sweeping remaining bright-white surfaces to the
  `.felt-surface` utility / warm tokens for cohesion (visual-skin scope).
- **XP awarded immediately on check-off**, even for approval-required tasks;
  parent approval just confirms (reject = undo + XP reversed). Rationale:
  kid-positive, grace-first; avoids a kid checking something off and seeing no
  reward while waiting on a grown-up.
- **Weekly / as-needed tasks shown under "Anytime & Extras"**, not in the daily
  completion ring. Only daily + weekday ("core") tasks count toward today's
  completion % and the derived mood. Rationale: avoids inflating/penalizing the
  daily ring with non-daily items.
- **Pet mood is derived live** from today's core completion % (not stored/
  overwritten). Reflective, never punitive.
- **Voice goal intake stubbed**, typed intake shipped — voice belongs with the
  AI coach (Phase 3). Logged in BLOCKED.md.
- **Undo reverses XP** (including family-pet XP) but never drops a level below
  what the remaining XP supports; progress from other tasks is untouched.
