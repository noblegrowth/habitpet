import { describe, it, expect, beforeEach } from "vitest";
import {
  resetData,
  createFamily,
  createFamilyPet,
  getFamilyPet,
  createChild,
  createChildPet,
  getChildPet,
} from "./storage.js";
import {
  resolveXp,
  isCoreDaily,
  isTaskDueOn,
  currentCheckInWindowId,
  seedChildTasks,
  addTemplateTask,
  createKidGoal,
  listChildTasks,
  isDone,
  completeTask,
  undoTask,
  streakForTask,
  pendingApprovals,
  approveCompletion,
  rejectCompletion,
  buildToday,
} from "./tasks.js";

const MON = "2026-06-01"; // Monday
const SUN = "2026-05-31"; // Sunday

let childId;
beforeEach(() => {
  resetData();
  createFamily({ name: "Fam", pin: "1234" });
  createFamilyPet({ petType: "capybara", petName: "Capy" });
  const c = createChild({ name: "Kid", ageBracket: "8-12" });
  createChildPet(c.id, { petType: "fox", petName: "Rusty" });
  childId = c.id;
});

describe("pure helpers", () => {
  it("resolveXp picks the age bracket", () => {
    expect(resolveXp({ defaultXP: { "8-12": 10, "13+": 8 } }, "8-12")).toBe(10);
    expect(resolveXp({ defaultXP: 25 }, "8-12")).toBe(25);
    expect(resolveXp({}, "8-12")).toBe(15); // fallback
  });

  it("isCoreDaily covers daily + weekday only", () => {
    expect(isCoreDaily({ frequency: "daily" })).toBe(true);
    expect(isCoreDaily({ frequency: "weekday" })).toBe(true);
    expect(isCoreDaily({ frequency: "weekly" })).toBe(false);
  });

  it("isTaskDueOn respects weekday frequency", () => {
    const wk = { isActive: true, frequency: "weekday" };
    expect(isTaskDueOn(wk, MON)).toBe(true);
    expect(isTaskDueOn(wk, SUN)).toBe(false);
    expect(isTaskDueOn({ isActive: true, frequency: "daily" }, SUN)).toBe(true);
    expect(isTaskDueOn({ isActive: false, frequency: "daily" }, MON)).toBe(false);
  });

  it("currentCheckInWindowId maps a time to its window", () => {
    expect(currentCheckInWindowId(new Date(2026, 5, 1, 8, 0))).toBe("before_school");
    expect(currentCheckInWindowId(new Date(2026, 5, 1, 6, 0))).toBe("wake_up"); // before first
    expect(currentCheckInWindowId(new Date(2026, 5, 1, 21, 0))).toBe("bedtime");
  });
});

describe("seeding", () => {
  it("seeds the onboarding defaults with numeric XP", () => {
    const seeded = seedChildTasks(childId, "8-12");
    expect(seeded.length).toBeGreaterThan(0);
    expect(listChildTasks(childId)).toHaveLength(seeded.length);
    seeded.forEach((t) => expect(typeof t.xpValue).toBe("number"));
    // brush_teeth_am @ 8-12 = 10
    const brush = seeded.find((t) => t.templateId === "brush_teeth_am");
    expect(brush.xpValue).toBe(10);
  });
});

describe("completion + XP", () => {
  it("awards XP to the child pet and is idempotent", () => {
    const t = addTemplateTask(childId, "reading_time", "8-12"); // 25 XP, no approval
    const res = completeTask({ childId, taskId: t.id, dateKey: MON });
    expect(res.xpAwarded).toBe(25);
    expect(getChildPet(childId).xp).toBe(25);
    expect(isDone(childId, t.id, MON)).toBe(true);
    // second time: no-op
    expect(completeTask({ childId, taskId: t.id, dateKey: MON })).toBeNull();
    expect(getChildPet(childId).xp).toBe(25);
  });

  it("feeds the family pet when the task does", () => {
    const t = addTemplateTask(childId, "feed_family_pet", "8-12");
    expect(t.feedsFamilyPet).toBe(true);
    completeTask({ childId, taskId: t.id, dateKey: MON });
    expect(getFamilyPet().xp).toBe(t.familyPetXp);
  });

  it("undo reverses the XP and removes the completion", () => {
    const t = addTemplateTask(childId, "reading_time", "8-12");
    completeTask({ childId, taskId: t.id, dateKey: MON });
    expect(undoTask({ childId, taskId: t.id, dateKey: MON })).toBe(true);
    expect(getChildPet(childId).xp).toBe(0);
    expect(isDone(childId, t.id, MON)).toBe(false);
  });

  it("tracks a per-task streak across days", () => {
    const t = addTemplateTask(childId, "reading_time", "8-12");
    completeTask({ childId, taskId: t.id, dateKey: "2026-05-30" });
    completeTask({ childId, taskId: t.id, dateKey: "2026-05-31" });
    completeTask({ childId, taskId: t.id, dateKey: "2026-06-01" });
    expect(streakForTask(childId, t.id, "2026-06-01").current).toBe(3);
  });
});

describe("parent approval queue", () => {
  it("queues approval-required completions and clears on approve", () => {
    const t = addTemplateTask(childId, "clean_room", "8-12"); // requiresApproval
    expect(t.requiresApproval).toBe(true);
    const res = completeTask({ childId, taskId: t.id, dateKey: MON });
    expect(res.xpAwarded).toBeGreaterThan(0); // XP awarded immediately (kid-positive)
    const queue = pendingApprovals();
    expect(queue).toHaveLength(1);
    approveCompletion(queue[0].completion.id);
    expect(pendingApprovals()).toHaveLength(0);
  });

  it("reject removes the completion and reverses XP", () => {
    const t = addTemplateTask(childId, "clean_room", "8-12");
    completeTask({ childId, taskId: t.id, dateKey: MON });
    const xpAfter = getChildPet(childId).xp;
    expect(xpAfter).toBeGreaterThan(0);
    const q = pendingApprovals();
    rejectCompletion(q[0].completion.id);
    expect(getChildPet(childId).xp).toBe(0);
    expect(isDone(childId, t.id, MON)).toBe(false);
  });
});

describe("kid-initiated goals", () => {
  it("creates a 1.5x bonus goal pending parent review", () => {
    const goal = createKidGoal(childId, { title: "Practice piano", ageBracket: "8-12" });
    expect(goal.isKidInitiated).toBe(true);
    expect(goal.xpValue).toBe(Math.round(25 * 1.5));
    expect(goal.requiresApproval).toBe(true);
  });
});

describe("buildToday", () => {
  it("groups core tasks by window and computes stats", () => {
    seedChildTasks(childId, "8-12");
    const today = buildToday(childId, MON, new Date(2026, 5, 1, 8, 0));
    expect(today.stats.totalCore).toBeGreaterThan(0);
    expect(today.windows.length).toBeGreaterThan(0);
    // weekly_reflection is an extra, not a core window task
    expect(today.extras.some((e) => e.task.templateId === "weekly_reflection")).toBe(true);

    // complete one core task → stats + xp update
    const brush = listChildTasks(childId).find((t) => t.templateId === "brush_teeth_am");
    completeTask({ childId, taskId: brush.id, dateKey: MON });
    const after = buildToday(childId, MON, new Date(2026, 5, 1, 8, 0));
    expect(after.stats.completedCore).toBe(1);
    expect(after.stats.xpToday).toBe(10);
    expect(after.stats.pct).toBe(Math.round((1 / after.stats.totalCore) * 100));
  });
});
