/**
 * HabitPet — Task Engine (Phase 2)
 *
 * Daily tasks are DERIVED, not pre-generated: a child has a set of active
 * `tasks` records; what's "due today" is computed from each task's frequency,
 * and completions are logged in `taskCompletions` keyed by local date. Streaks
 * and XP are read back from that log. (Rationale in docs/DECISIONS.md.)
 */
import {
  TASK_TEMPLATES,
  CHECK_IN_WINDOWS,
  getOnboardingDefaults,
} from "../data/habitpet-task-templates.js";
import {
  tasks as tasksStore,
  taskCompletions,
  childPets,
  getChildPet,
  getFamily,
  addFamilyPetXp,
  getFamilyPet,
  updateFamilyPet,
  children as childrenStore,
} from "./storage.js";
import { levelForXp } from "./xp.js";
import { computeStreak } from "./streaks.js";
import { todayKey, isWeekday, timeToMinutes } from "./date.js";

// ─────────────────────────────────────────────
// Pure scheduling helpers
// ─────────────────────────────────────────────

/** Resolve a template's age-bracket XP to a single number. */
export function resolveXp(template, ageBracket) {
  const xp = template?.defaultXP;
  if (typeof xp === "number") return xp;
  return xp?.[ageBracket] ?? 15;
}

/** Core daily habits (count toward the day's completion ring). */
export function isCoreDaily(task) {
  return task.frequency === "daily" || task.frequency === "weekday";
}

/** Whether a task should appear on a given date. */
export function isTaskDueOn(task, dateKey = todayKey()) {
  if (!task.isActive) return false;
  switch (task.frequency) {
    case "weekday":
      return isWeekday(dateKey);
    case "daily":
    case "weekly":
    case "as-needed":
      return true;
    default:
      return true;
  }
}

// Windows in chronological order (drives display + "current window").
export const WINDOW_ORDER = Object.values(CHECK_IN_WINDOWS)
  .slice()
  .sort((a, b) => timeToMinutes(a.defaultTime) - timeToMinutes(b.defaultTime))
  .map((w) => w.id);

const WINDOW_BY_ID = Object.fromEntries(
  Object.values(CHECK_IN_WINDOWS).map((w) => [w.id, w]),
);

/** Which check-in window "now" falls into (latest window whose time has passed). */
export function currentCheckInWindowId(now = new Date()) {
  const mins = now.getHours() * 60 + now.getMinutes();
  let current = WINDOW_ORDER[0];
  for (const id of WINDOW_ORDER) {
    if (timeToMinutes(WINDOW_BY_ID[id].defaultTime) <= mins) current = id;
  }
  return current;
}

// ─────────────────────────────────────────────
// Seeding & creation
// ─────────────────────────────────────────────

function buildTaskRecord(childId, template, ageBracket, overrides = {}) {
  return {
    childId,
    familyId: getFamily()?.id ?? null,
    templateId: template.id,
    title: template.title,
    category: template.category,
    frequency: template.frequency,
    xpValue: resolveXp(template, ageBracket),
    icon: template.icon,
    requiresApproval: template.requiresApproval ?? false,
    checkInWindows: template.checkInWindows ?? [],
    characterTraits: template.characterTraits ?? [],
    skillTreeNode: template.skillTreeNode ?? null,
    isBonus: template.isBonus ?? false,
    bonusMultiplier: template.bonusMultiplier ?? 1.0,
    feedsFamilyPet: template.feedsFamilyPet ?? false,
    familyPetXp: template.familyPetXp ?? 0,
    isKidInitiated: false,
    isActive: true,
    ...overrides,
  };
}

/** Create the starter task set for a newly onboarded child. */
export function seedChildTasks(childId, ageBracket) {
  const defaults = getOnboardingDefaults(ageBracket);
  return defaults.map((tpl) => tasksStore.create(buildTaskRecord(childId, tpl, ageBracket)));
}

/** Add a single template task to a child. */
export function addTemplateTask(childId, templateId, ageBracket, overrides = {}) {
  const tpl = TASK_TEMPLATES.find((t) => t.id === templateId);
  if (!tpl) throw new Error(`Unknown template: ${templateId}`);
  return tasksStore.create(buildTaskRecord(childId, tpl, ageBracket, overrides));
}

/** Kid-initiated goal (1.5× bonus, parent review). plan §pillar 2. */
export function createKidGoal(childId, { title, ageBracket, frequency = "daily" }) {
  const base = { "4-7": 20, "8-12": 25, "13+": 30 }[ageBracket] ?? 25;
  return tasksStore.create({
    childId,
    familyId: getFamily()?.id ?? null,
    templateId: null,
    title: title.trim(),
    category: "kid_goal",
    frequency,
    xpValue: Math.round(base * 1.5),
    icon: "🚀",
    requiresApproval: true,
    checkInWindows: ["mid_afternoon", "last_chance"],
    characterTraits: ["ambition", "grit"],
    isBonus: false,
    bonusMultiplier: 1.0,
    isKidInitiated: true,
    kidInitiatedBonus: true,
    isActive: true,
    pendingParentReview: true,
  });
}

// ─────────────────────────────────────────────
// Queries
// ─────────────────────────────────────────────

export function listChildTasks(childId) {
  return tasksStore.where((t) => t.childId === childId && t.isActive);
}

export function completionsForChild(childId) {
  return taskCompletions.where((c) => c.childId === childId);
}

function completionDateKeys(childId, taskId) {
  return completionsForChild(childId)
    .filter((c) => c.taskId === taskId)
    .map((c) => c.dateKey ?? todayKey(new Date(c.completedAt)));
}

export function isDone(childId, taskId, dateKey = todayKey()) {
  return completionsForChild(childId).some(
    (c) => c.taskId === taskId && (c.dateKey ?? todayKey(new Date(c.completedAt))) === dateKey,
  );
}

export function streakForTask(childId, taskId, today = todayKey()) {
  return computeStreak(completionDateKeys(childId, taskId), today);
}

// ─────────────────────────────────────────────
// Mutations (completion + XP)
// ─────────────────────────────────────────────

/**
 * Check off a task for a date. Awards XP to the child's pet (and the family pet
 * if the task feeds it). Idempotent per task+date. Returns award info or null.
 */
export function completeTask({ childId, taskId, dateKey = todayKey(), window = null, now = new Date() }) {
  if (isDone(childId, taskId, dateKey)) return null;
  const task = tasksStore.get(taskId);
  if (!task) return null;

  const xp = Math.round((task.xpValue ?? 0) * (task.bonusMultiplier ?? 1));
  const priorKeys = completionDateKeys(childId, taskId);
  const streak = computeStreak([...priorKeys, dateKey], dateKey);

  const pet = getChildPet(childId);
  const beforeLevel = levelForXp(pet?.xp ?? 0);
  const afterXp = (pet?.xp ?? 0) + xp;

  const completion = taskCompletions.create({
    taskId,
    childId,
    familyId: getFamily()?.id ?? null,
    completedAt: now.toISOString(),
    dateKey,
    checkInWindow: window,
    xpAwarded: xp,
    approvedAt: task.requiresApproval ? null : now.toISOString(),
    approvedBy: task.requiresApproval ? null : "auto",
    pendingApproval: Boolean(task.requiresApproval),
    streakDay: streak.current,
  });

  if (pet) {
    childPets.update(pet.id, {
      xp: afterXp,
      level: levelForXp(afterXp),
      totalXpEarned: (pet.totalXpEarned ?? 0) + xp,
    });
  }
  if (task.feedsFamilyPet && task.familyPetXp) {
    const fp = addFamilyPetXp(task.familyPetXp);
    if (fp) updateFamilyPet({ level: levelForXp(fp.xp) });
  }

  return {
    completion,
    xpAwarded: xp,
    leveledUp: levelForXp(afterXp) > beforeLevel,
    level: levelForXp(afterXp),
    streak,
  };
}

/** Undo a check-off (correction, not punishment): removes it and reverses XP. */
export function undoTask({ childId, taskId, dateKey = todayKey() }) {
  const comp = completionsForChild(childId).find(
    (c) => c.taskId === taskId && (c.dateKey ?? todayKey(new Date(c.completedAt))) === dateKey,
  );
  if (!comp) return false;

  const task = tasksStore.get(taskId);
  const pet = getChildPet(childId);
  if (pet) {
    const afterXp = Math.max(0, (pet.xp ?? 0) - (comp.xpAwarded ?? 0));
    childPets.update(pet.id, {
      xp: afterXp,
      level: levelForXp(afterXp),
      totalXpEarned: Math.max(0, (pet.totalXpEarned ?? 0) - (comp.xpAwarded ?? 0)),
    });
  }
  if (task?.feedsFamilyPet && task.familyPetXp) {
    const fp = getFamilyPet();
    if (fp) updateFamilyPet({ xp: Math.max(0, (fp.xp ?? 0) - task.familyPetXp), level: levelForXp(Math.max(0, (fp.xp ?? 0) - task.familyPetXp)) });
  }
  return taskCompletions.remove(comp.id);
}

// ─────────────────────────────────────────────
// Parent approval queue
// ─────────────────────────────────────────────

/** Completions still awaiting parent sign-off, newest first, with task+child. */
export function pendingApprovals(familyId = getFamily()?.id ?? null) {
  return taskCompletions
    .where((c) => c.pendingApproval && !c.approvedAt && (familyId == null || c.familyId === familyId))
    .map((c) => ({
      completion: c,
      task: tasksStore.get(c.taskId),
      child: childrenStore.get(c.childId),
    }))
    .sort((a, b) => (a.completion.completedAt < b.completion.completedAt ? 1 : -1));
}

export function approveCompletion(completionId, now = new Date()) {
  return taskCompletions.update(completionId, {
    approvedAt: now.toISOString(),
    approvedBy: "parent",
    pendingApproval: false,
  });
}

/** Reject = undo the completion entirely (reverses XP). */
export function rejectCompletion(completionId) {
  const comp = taskCompletions.get(completionId);
  if (!comp) return false;
  return undoTask({ childId: comp.childId, taskId: comp.taskId, dateKey: comp.dateKey });
}

// ─────────────────────────────────────────────
// Today view (assembled for the UI)
// ─────────────────────────────────────────────

/**
 * Everything ChildWorld needs for "Today's Journey":
 *  { windows:[{id,label,icon,isCurrent,tasks:[{task,done}]}], extras:[{task,done}],
 *    stats:{ completedCore,totalCore,pct,xpToday }, currentWindow }
 */
export function buildToday(childId, dateKey = todayKey(), now = new Date()) {
  const due = listChildTasks(childId).filter((t) => isTaskDueOn(t, dateKey));
  const doneSet = new Set(
    completionsForChild(childId)
      .filter((c) => (c.dateKey ?? todayKey(new Date(c.completedAt))) === dateKey)
      .map((c) => c.taskId),
  );

  const core = due.filter(isCoreDaily);
  const extras = due.filter((t) => !isCoreDaily(t));
  const currentWindow = currentCheckInWindowId(now);

  const windows = WINDOW_ORDER.map((id) => {
    const w = WINDOW_BY_ID[id];
    const wtasks = core
      .filter((t) => (t.checkInWindows ?? []).includes(id))
      .map((t) => ({ task: t, done: doneSet.has(t.id) }));
    return { id, label: w.label, icon: w.icon, isCurrent: id === currentWindow, tasks: wtasks };
  }).filter((w) => w.tasks.length > 0);

  // Core tasks with no listed window land in an "Anytime" group.
  const noWindow = core
    .filter((t) => !(t.checkInWindows ?? []).some((id) => WINDOW_BY_ID[id]))
    .map((t) => ({ task: t, done: doneSet.has(t.id) }));
  if (noWindow.length) {
    windows.push({ id: "anytime", label: "Anytime", icon: "⭐", isCurrent: false, tasks: noWindow });
  }

  const completedCore = core.filter((t) => doneSet.has(t.id)).length;
  const totalCore = core.length;
  const pct = totalCore === 0 ? 0 : Math.round((completedCore / totalCore) * 100);
  const xpToday = completionsForChild(childId)
    .filter((c) => (c.dateKey ?? todayKey(new Date(c.completedAt))) === dateKey)
    .reduce((sum, c) => sum + (c.xpAwarded ?? 0), 0);

  return {
    windows,
    extras: extras.map((t) => ({ task: t, done: doneSet.has(t.id) })),
    stats: { completedCore, totalCore, pct, xpToday },
    currentWindow,
  };
}
