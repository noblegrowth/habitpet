import { describe, it, expect } from "vitest";
import {
  todayKey,
  parseKey,
  addDays,
  diffDays,
  dayOfWeek,
  isWeekday,
  dayName,
  timeToMinutes,
} from "./date.js";

describe("todayKey", () => {
  it("formats a local date as YYYY-MM-DD with zero padding", () => {
    expect(todayKey(new Date(2026, 0, 5))).toBe("2026-01-05");
    expect(todayKey(new Date(2026, 11, 31))).toBe("2026-12-31");
  });
});

describe("parseKey / addDays", () => {
  it("round-trips a key", () => {
    expect(todayKey(parseKey("2026-06-01"))).toBe("2026-06-01");
  });

  it("adds and subtracts days across month and year boundaries", () => {
    expect(addDays("2026-01-31", 1)).toBe("2026-02-01");
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
    expect(addDays("2026-06-15", 0)).toBe("2026-06-15");
  });
});

describe("diffDays", () => {
  it("returns whole-day signed differences", () => {
    expect(diffDays("2026-06-02", "2026-06-01")).toBe(1);
    expect(diffDays("2026-06-01", "2026-06-02")).toBe(-1);
    expect(diffDays("2026-06-01", "2026-06-01")).toBe(0);
    expect(diffDays("2026-07-01", "2026-06-01")).toBe(30);
  });
});

describe("dayOfWeek / isWeekday / dayName", () => {
  it("knows weekends from weekdays (2026-05-31 is a Sunday)", () => {
    expect(dayOfWeek("2026-05-31")).toBe(0);
    expect(isWeekday("2026-05-31")).toBe(false);
    expect(dayName("2026-05-31")).toBe("Sunday");
    expect(isWeekday("2026-06-01")).toBe(true); // Monday
    expect(dayName("2026-06-01")).toBe("Monday");
    expect(isWeekday("2026-06-06")).toBe(false); // Saturday
  });
});

describe("timeToMinutes", () => {
  it("converts HH:MM to minutes since midnight", () => {
    expect(timeToMinutes("00:00")).toBe(0);
    expect(timeToMinutes("07:45")).toBe(465);
    expect(timeToMinutes("20:30")).toBe(1230);
  });
});
