import { describe, it, expect, beforeEach } from "vitest";
import {
  SCHEMA_VERSION,
  genId,
  hashPin,
  verifyPin,
  getDefaultData,
  loadData,
  saveData,
  resetData,
  isOnboarded,
  children,
  childPets,
  tasks,
  createFamily,
  getFamily,
  updateFamily,
  verifyParentPin,
  getFamilyPet,
  createFamilyPet,
  updateFamilyPet,
  addFamilyPetXp,
  createChild,
  verifyChildPin,
  createChildPet,
  getChildPet,
  createChildWithPet,
  listChildrenWithPets,
} from "./storage.js";

beforeEach(() => {
  resetData();
});

describe("primitives", () => {
  it("genId returns unique-ish strings", () => {
    const a = genId();
    const b = genId();
    expect(typeof a).toBe("string");
    expect(a).not.toBe(b);
  });

  it("hashPin never returns plaintext and is deterministic", () => {
    expect(hashPin("1234")).toBe(hashPin("1234"));
    expect(hashPin("1234")).not.toBe("1234");
    expect(hashPin("1234")).not.toBe(hashPin("1235"));
  });

  it("hashPin returns null for empty input", () => {
    expect(hashPin("")).toBeNull();
    expect(hashPin(null)).toBeNull();
    expect(hashPin(undefined)).toBeNull();
  });

  it("verifyPin matches the hash and treats no-PIN as open", () => {
    const h = hashPin("4321");
    expect(verifyPin("4321", h)).toBe(true);
    expect(verifyPin("0000", h)).toBe(false);
    expect(verifyPin("anything", null)).toBe(true);
  });
});

describe("root document", () => {
  it("defaults include every entity and the schema version", () => {
    const d = getDefaultData();
    expect(d.schemaVersion).toBe(SCHEMA_VERSION);
    expect(d.family).toBeNull();
    expect(d.familyPet).toBeNull();
    [
      "children", "childPets", "tasks", "taskCompletions", "streaks",
      "badges", "characterTraitProgress", "skillTreeProgress",
      "conversations", "weeklyReflections", "xpThresholds",
      "parentNudges", "notables", "emotes",
    ].forEach((key) => {
      expect(Array.isArray(d[key])).toBe(true);
      expect(d[key]).toHaveLength(0);
    });
  });

  it("load returns defaults when storage is empty", () => {
    expect(loadData().children).toEqual([]);
  });

  it("save then load round-trips data", () => {
    const d = getDefaultData();
    d.tasks.push({ id: "t1", title: "Test" });
    saveData(d);
    expect(loadData().tasks).toHaveLength(1);
    expect(loadData().tasks[0].title).toBe("Test");
  });

  it("load merges over defaults so new fields appear", () => {
    saveData({ children: [{ id: "c1" }] }); // partial doc, missing other keys
    const d = loadData();
    expect(d.children).toHaveLength(1);
    expect(Array.isArray(d.tasks)).toBe(true); // backfilled
  });

  it("recovers from corrupt JSON", () => {
    globalThis.localStorage.setItem("habitpet_data", "{not valid json");
    expect(loadData().children).toEqual([]);
  });

  it("resetData clears everything", () => {
    createFamily({ name: "X", pin: "1111" });
    expect(getFamily()).not.toBeNull();
    resetData();
    expect(getFamily()).toBeNull();
  });
});

describe("generic collection (children)", () => {
  it("creates with id + timestamps + schema defaults", () => {
    const c = children.create({ name: "Ada" });
    expect(c.id).toBeTruthy();
    expect(c.createdAt).toBeTruthy();
    expect(c.updatedAt).toBeTruthy();
    expect(c.ageBracket).toBe("8-12"); // default
    expect(c.interests).toEqual([]);
    expect(c.name).toBe("Ada");
  });

  it("lists and gets by id", () => {
    const c = children.create({ name: "Bo" });
    expect(children.list()).toHaveLength(1);
    expect(children.get(c.id).name).toBe("Bo");
    expect(children.get("missing")).toBeNull();
  });

  it("filters with where()", () => {
    children.create({ name: "A", ageBracket: "4-7" });
    children.create({ name: "B", ageBracket: "13+" });
    expect(children.where((c) => c.ageBracket === "4-7")).toHaveLength(1);
  });

  it("updates without changing id and bumps updatedAt", () => {
    const c = children.create({ name: "Cy" });
    const updated = children.update(c.id, { name: "Cyrus", id: "hacked" });
    expect(updated.id).toBe(c.id);
    expect(updated.name).toBe("Cyrus");
    expect(children.get(c.id).name).toBe("Cyrus");
  });

  it("update returns null for missing id", () => {
    expect(children.update("nope", { name: "X" })).toBeNull();
  });

  it("removes by id", () => {
    const c = children.create({ name: "Dee" });
    expect(children.remove(c.id)).toBe(true);
    expect(children.list()).toHaveLength(0);
    expect(children.remove(c.id)).toBe(false);
  });
});

describe("family singleton", () => {
  it("creates a family with a hashed PIN", () => {
    const fam = createFamily({ name: "The Gallos", pin: "1234" });
    expect(fam.name).toBe("The Gallos");
    expect(fam.parentPin).not.toBe("1234");
    expect(fam.timezone).toBe("America/Chicago");
    expect(getFamily().id).toBe(fam.id);
  });

  it("verifies the parent PIN", () => {
    createFamily({ name: "Fam", pin: "9999" });
    expect(verifyParentPin("9999")).toBe(true);
    expect(verifyParentPin("0000")).toBe(false);
  });

  it("updates and re-hashes the PIN", () => {
    createFamily({ name: "Fam", pin: "1111" });
    updateFamily({ name: "Renamed", pin: "2222" });
    expect(getFamily().name).toBe("Renamed");
    expect(verifyParentPin("2222")).toBe(true);
    expect(verifyParentPin("1111")).toBe(false);
  });

  it("update returns null when no family exists", () => {
    expect(updateFamily({ name: "X" })).toBeNull();
  });
});

describe("family pet singleton", () => {
  it("creates with starting stats and links to family", () => {
    createFamily({ name: "Fam", pin: "1234" });
    const pet = createFamilyPet({ petType: "capybara", petName: "Capy" });
    expect(pet.petType).toBe("capybara");
    expect(pet.xp).toBe(0);
    expect(pet.level).toBe(1);
    expect(pet.mood).toBe("happy");
    expect(pet.familyId).toBe(getFamily().id);
  });

  it("updates and accumulates XP (never negative)", () => {
    createFamilyPet({ petType: "otter", petName: "Pip" });
    updateFamilyPet({ mood: "thriving" });
    expect(getFamilyPet().mood).toBe("thriving");
    addFamilyPetXp(40);
    addFamilyPetXp(-100); // ignored
    expect(getFamilyPet().xp).toBe(40);
  });
});

describe("isOnboarded", () => {
  it("is false until family + family pet both exist", () => {
    expect(isOnboarded()).toBe(false);
    createFamily({ name: "Fam", pin: "1234" });
    expect(isOnboarded()).toBe(false);
    createFamilyPet({ petType: "whale", petName: "Atlas" });
    expect(isOnboarded()).toBe(true);
  });
});

describe("child + pet helpers", () => {
  it("createChild hashes the optional PIN", () => {
    const c = createChild({ name: "Kid", ageBracket: "8-12", pin: "4242" });
    expect(c.pin).not.toBe("4242");
    expect(verifyChildPin(c.id, "4242")).toBe(true);
    expect(verifyChildPin(c.id, "0000")).toBe(false);
  });

  it("a child without a PIN is always open", () => {
    const c = createChild({ name: "OpenKid", ageBracket: "4-7" });
    expect(c.pin).toBeNull();
    expect(verifyChildPin(c.id, "")).toBe(true);
    expect(verifyChildPin(c.id, "1234")).toBe(true);
  });

  it("verifyChildPin is false for an unknown child", () => {
    expect(verifyChildPin("ghost", "1234")).toBe(false);
  });

  it("createChildPet links to the child", () => {
    const c = createChild({ name: "Kid" });
    const pet = createChildPet(c.id, { petType: "dragon", petName: "Blaze" });
    expect(pet.childId).toBe(c.id);
    expect(getChildPet(c.id).petName).toBe("Blaze");
  });

  it("createChildWithPet returns both records joined to the child", () => {
    const { child, pet } = createChildWithPet(
      { name: "Mia", ageBracket: "13+" },
      { petType: "fox", petName: "Rusty" },
    );
    expect(child.name).toBe("Mia");
    expect(pet.childId).toBe(child.id);
  });

  it("listChildrenWithPets joins each child to their pet", () => {
    createChildWithPet({ name: "A" }, { petType: "owl", petName: "Sage" });
    createChild({ name: "B" }); // no pet yet
    const list = listChildrenWithPets();
    expect(list).toHaveLength(2);
    expect(list.find((c) => c.name === "A").pet.petType).toBe("owl");
    expect(list.find((c) => c.name === "B").pet).toBeNull();
  });
});

describe("collections backfill defaults (spot check)", () => {
  it("childPets start at level 1 / 0 xp", () => {
    const p = childPets.create({ childId: "x" });
    expect(p.level).toBe(1);
    expect(p.xp).toBe(0);
    expect(p.roomTheme).toBe("meadow");
  });

  it("tasks default to active, daily, not bonus", () => {
    const t = tasks.create({ title: "Brush teeth" });
    expect(t.isActive).toBe(true);
    expect(t.frequency).toBe("daily");
    expect(t.isBonus).toBe(false);
    expect(t.bonusMultiplier).toBe(1.0);
  });
});
