import { describe, it, expect } from "vitest";
import { computeStreak } from "./streaks.js";

const TODAY = "2026-06-10";

describe("computeStreak", () => {
  it("is all zeros with no completions", () => {
    expect(computeStreak([], TODAY)).toEqual({
      current: 0,
      longest: 0,
      lastCompleted: null,
      atRisk: false,
    });
  });

  it("counts a single completion today", () => {
    const s = computeStreak(["2026-06-10"], TODAY);
    expect(s.current).toBe(1);
    expect(s.longest).toBe(1);
    expect(s.atRisk).toBe(false);
  });

  it("keeps the streak alive but at risk when last done was yesterday", () => {
    const s = computeStreak(["2026-06-08", "2026-06-09"], TODAY);
    expect(s.current).toBe(2);
    expect(s.atRisk).toBe(true);
  });

  it("breaks current to 0 when the gap is more than a day", () => {
    const s = computeStreak(["2026-06-06", "2026-06-07"], TODAY);
    expect(s.current).toBe(0);
    expect(s.longest).toBe(2);
    expect(s.atRisk).toBe(false);
  });

  it("counts a consecutive run ending today", () => {
    const s = computeStreak(
      ["2026-06-07", "2026-06-08", "2026-06-09", "2026-06-10"],
      TODAY,
    );
    expect(s.current).toBe(4);
    expect(s.longest).toBe(4);
  });

  it("reports longest > current when an earlier run was longer", () => {
    const s = computeStreak(
      ["2026-06-01", "2026-06-02", "2026-06-03", "2026-06-10"],
      TODAY,
    );
    expect(s.current).toBe(1); // just today
    expect(s.longest).toBe(3); // the June 1–3 run
  });

  it("ignores duplicate dates", () => {
    const s = computeStreak(["2026-06-10", "2026-06-10", "2026-06-09"], TODAY);
    expect(s.current).toBe(2);
    expect(s.lastCompleted).toBe("2026-06-10");
  });
});
