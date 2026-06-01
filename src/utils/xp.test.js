import { describe, it, expect } from "vitest";
import {
  MAX_LEVEL,
  xpForLevel,
  levelForXp,
  levelProgress,
  moodForCompletion,
} from "./xp.js";

describe("xpForLevel", () => {
  it("starts level 1 at 0 XP", () => {
    expect(xpForLevel(1)).toBe(0);
  });

  it("follows the 25*(L-1)*L curve", () => {
    expect(xpForLevel(2)).toBe(50);
    expect(xpForLevel(3)).toBe(150);
    expect(xpForLevel(4)).toBe(300);
  });

  it("is strictly increasing across all levels", () => {
    for (let l = 2; l <= MAX_LEVEL; l += 1) {
      expect(xpForLevel(l)).toBeGreaterThan(xpForLevel(l - 1));
    }
  });

  it("clamps level input to [1, MAX_LEVEL]", () => {
    expect(xpForLevel(0)).toBe(0);
    expect(xpForLevel(-5)).toBe(0);
    expect(xpForLevel(999)).toBe(xpForLevel(MAX_LEVEL));
  });
});

describe("levelForXp", () => {
  it("is level 1 at 0 XP", () => {
    expect(levelForXp(0)).toBe(1);
  });

  it("levels up exactly at the threshold", () => {
    expect(levelForXp(49)).toBe(1);
    expect(levelForXp(50)).toBe(2);
    expect(levelForXp(149)).toBe(2);
    expect(levelForXp(150)).toBe(3);
  });

  it("never exceeds MAX_LEVEL", () => {
    expect(levelForXp(99999999)).toBe(MAX_LEVEL);
  });

  it("treats negative / invalid XP as 0", () => {
    expect(levelForXp(-100)).toBe(1);
    expect(levelForXp(undefined)).toBe(1);
    expect(levelForXp(NaN)).toBe(1);
  });
});

describe("levelProgress", () => {
  it("reports progress within a level", () => {
    const p = levelProgress(75); // level 2 (floor 50, ceil 150)
    expect(p.level).toBe(2);
    expect(p.into).toBe(25);
    expect(p.span).toBe(100);
    expect(p.pct).toBe(25);
    expect(p.nextLevelXp).toBe(150);
    expect(p.isMax).toBe(false);
  });

  it("reports 0% right after leveling up", () => {
    expect(levelProgress(50).pct).toBe(0);
    expect(levelProgress(150).pct).toBe(0);
  });

  it("caps at 100% / isMax at the top level", () => {
    const p = levelProgress(xpForLevel(MAX_LEVEL) + 1000);
    expect(p.level).toBe(MAX_LEVEL);
    expect(p.pct).toBe(100);
    expect(p.isMax).toBe(true);
    expect(p.nextLevelXp).toBeNull();
  });
});

describe("moodForCompletion", () => {
  it("maps completion bands to moods", () => {
    expect(moodForCompletion(95)).toBe("thriving");
    expect(moodForCompletion(80)).toBe("thriving");
    expect(moodForCompletion(70)).toBe("happy");
    expect(moodForCompletion(50)).toBe("okay");
    expect(moodForCompletion(25)).toBe("tired");
    expect(moodForCompletion(5)).toBe("struggling");
    expect(moodForCompletion(0)).toBe("struggling");
  });

  it("clamps out-of-range input", () => {
    expect(moodForCompletion(150)).toBe("thriving");
    expect(moodForCompletion(-20)).toBe("struggling");
  });
});
