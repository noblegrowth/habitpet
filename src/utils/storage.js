/**
 * HabitPet — localStorage Data Layer (Phase 1)
 *
 * Single source of truth for all app data, stored under one key
 * (`habitpet_data`). The shape mirrors the Supabase schema in
 * /supabase/migrations/001_habitpet_initial.sql so the Phase 6 migration is a
 * straight copy (snake_case columns ↔ camelCase fields).
 *
 * Conventions
 *  - Singletons (one per device in Phase 1): `family`, `familyPet`.
 *  - Collections: arrays of records, each with `id`, `createdAt`, `updatedAt`.
 *  - All writes go through saveData() so persistence is atomic per call.
 *  - PINs are never stored in plaintext — see hashPin(). (Light obfuscation for
 *    a shared family tablet, NOT cryptographic security.)
 */

const STORAGE_KEY = "habitpet_data";
export const SCHEMA_VERSION = 1;

// ─────────────────────────────────────────────
// Low-level primitives
// ─────────────────────────────────────────────

function safeStorage() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

export function genId() {
  const c = globalThis.crypto;
  if (c?.randomUUID) return c.randomUUID();
  // Fallback for environments without crypto.randomUUID
  return "id-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function nowIso() {
  return new Date().toISOString();
}

/**
 * One-way PIN hash. Deterministic djb2 with a namespace salt.
 * Not secure — just keeps PINs out of plaintext in localStorage.
 */
export function hashPin(pin) {
  if (pin === null || pin === undefined || pin === "") return null;
  const str = `habitpet::${String(pin)}`;
  let h = 5381;
  for (let i = 0; i < str.length; i += 1) {
    h = ((h << 5) + h + str.charCodeAt(i)) >>> 0;
  }
  return "h" + h.toString(36);
}

export function verifyPin(pin, hash) {
  if (!hash) return true; // no PIN set → open
  return hashPin(pin) === hash;
}

// ─────────────────────────────────────────────
// Root document
// ─────────────────────────────────────────────

export function getDefaultData() {
  return {
    schemaVersion: SCHEMA_VERSION,
    family: null, // singleton
    familyPet: null, // singleton
    children: [],
    childPets: [],
    tasks: [],
    taskCompletions: [],
    streaks: [],
    badges: [],
    characterTraitProgress: [],
    skillTreeProgress: [],
    conversations: [],
    weeklyReflections: [],
    xpThresholds: [],
    parentNudges: [],
    notables: [],
    emotes: [],
  };
}

export function loadData() {
  const ls = safeStorage();
  if (!ls) return getDefaultData();
  const raw = ls.getItem(STORAGE_KEY);
  if (!raw) return getDefaultData();
  try {
    const parsed = JSON.parse(raw);
    // Merge over defaults so new fields are always present.
    return { ...getDefaultData(), ...parsed };
  } catch {
    return getDefaultData();
  }
}

export function saveData(data) {
  const ls = safeStorage();
  if (ls) ls.setItem(STORAGE_KEY, JSON.stringify(data));
  return data;
}

export function resetData() {
  const ls = safeStorage();
  if (ls) ls.removeItem(STORAGE_KEY);
  return getDefaultData();
}

/** True once a family + family pet have been set up. */
export function isOnboarded() {
  const data = loadData();
  return Boolean(data.family && data.familyPet);
}

// ─────────────────────────────────────────────
// Generic collection factory
// ─────────────────────────────────────────────

/**
 * Build a typed CRUD interface over one array key in the root document.
 * `defaults(attrs)` supplies schema-default fields for new records.
 */
function makeCollection(key, defaults = () => ({})) {
  return {
    list() {
      return loadData()[key];
    },
    where(predicate) {
      return loadData()[key].filter(predicate);
    },
    get(id) {
      return loadData()[key].find((x) => x.id === id) ?? null;
    },
    create(attrs = {}) {
      const data = loadData();
      const now = nowIso();
      const item = {
        ...defaults(attrs),
        ...attrs,
        id: attrs.id ?? genId(),
        createdAt: now,
        updatedAt: now,
      };
      data[key] = [...data[key], item];
      saveData(data);
      return item;
    },
    update(id, patch = {}) {
      const data = loadData();
      let updated = null;
      data[key] = data[key].map((x) => {
        if (x.id !== id) return x;
        updated = { ...x, ...patch, id: x.id, updatedAt: nowIso() };
        return updated;
      });
      if (updated) saveData(data);
      return updated;
    },
    remove(id) {
      const data = loadData();
      const next = data[key].filter((x) => x.id !== id);
      const removed = next.length < data[key].length;
      if (removed) {
        data[key] = next;
        saveData(data);
      }
      return removed;
    },
  };
}

// ─────────────────────────────────────────────
// Collections (one per schema table)
// ─────────────────────────────────────────────

export const children = makeCollection("children", () => ({
  familyId: null,
  ageBracket: "8-12",
  pin: null,
  avatarColor: "#7DD3FC",
  interests: [],
}));

export const childPets = makeCollection("childPets", () => ({
  childId: null,
  xp: 0,
  level: 1,
  mood: "happy",
  accessories: [],
  roomTheme: "meadow",
  totalXpEarned: 0,
}));

export const tasks = makeCollection("tasks", () => ({
  childId: null,
  familyId: null,
  templateId: null,
  category: "kid_goal",
  frequency: "daily",
  xpValue: 15,
  icon: "⭐",
  requiresApproval: false,
  checkInWindows: [],
  characterTraits: [],
  skillTreeNode: null,
  isBonus: false,
  bonusMultiplier: 1.0,
  feedsFamilyPet: false,
  familyPetXp: 0,
  isKidInitiated: false,
  kidInitiatedBonus: false,
  isActive: true,
  pendingParentReview: false,
  notes: null,
}));

export const taskCompletions = makeCollection("taskCompletions", () => ({
  taskId: null,
  childId: null,
  familyId: null,
  completedAt: nowIso(),
  checkInWindow: null,
  xpAwarded: 0,
  approvedAt: null,
  approvedBy: null,
  streakDay: 1,
  noteFromChild: null,
}));

export const streaks = makeCollection("streaks", () => ({
  childId: null,
  taskId: null,
  category: null,
  currentStreak: 0,
  longestStreak: 0,
  lastCompleted: null,
  atRisk: false,
}));

export const badges = makeCollection("badges", () => ({
  childId: null,
  badgeType: null,
  badgeLabel: "",
  badgeIcon: null,
  earnedAt: nowIso(),
  xpBonus: 0,
}));

export const characterTraitProgress = makeCollection("characterTraitProgress", () => ({
  childId: null,
  trait: null,
  points: 0,
  level: 0,
  lastEarnedAt: null,
}));

export const skillTreeProgress = makeCollection("skillTreeProgress", () => ({
  childId: null,
  nodeId: null,
  completions: 0,
  unlocked: false,
  unlockedAt: null,
}));

export const conversations = makeCollection("conversations", () => ({
  childId: null,
  mode: "free_chat",
  checkInWindow: null,
  messages: [],
  startedAt: nowIso(),
  endedAt: null,
  notableShown: null,
}));

export const weeklyReflections = makeCollection("weeklyReflections", () => ({
  childId: null,
  familyId: null,
  weekStart: null,
  weekEnd: null,
  stats: {},
  petReportText: null,
  childResponse: null,
  reframeText: null,
  completedAt: null,
  nudgeSentAt: null,
}));

export const xpThresholds = makeCollection("xpThresholds", () => ({
  familyId: null,
  childId: null,
  xpAmount: 0,
  label: "",
  rewardText: null,
  icon: "🏆",
  isActive: true,
  triggeredAt: null,
}));

export const parentNudges = makeCollection("parentNudges", () => ({
  familyId: null,
  childId: null,
  nudgeType: null,
  message: "",
  issueData: null,
  isRead: false,
  readAt: null,
}));

export const notables = makeCollection("notables", () => ({
  familyId: null,
  category: null,
  text: "",
  source: null,
  ageBrackets: ["4-7", "8-12", "13+"],
  tags: [],
  isActive: true,
}));

export const emotes = makeCollection("emotes", () => ({
  familyId: null,
  childId: null,
  emoteKey: null,
  emoteLabel: "",
  emoteAssetUrl: null,
  unlockMethod: "default",
  unlockCondition: null,
  unlockedAt: null,
}));

// ─────────────────────────────────────────────
// Family (singleton)
// ─────────────────────────────────────────────

export function getFamily() {
  return loadData().family;
}

export function createFamily({ name, pin, timezone } = {}) {
  const data = loadData();
  const now = nowIso();
  data.family = {
    id: genId(),
    name: name ?? "Our Family",
    parentPin: hashPin(pin),
    timezone: timezone ?? "America/Chicago",
    createdAt: now,
    updatedAt: now,
  };
  saveData(data);
  return data.family;
}

export function updateFamily(patch = {}) {
  const data = loadData();
  if (!data.family) return null;
  const { pin, ...rest } = patch;
  data.family = {
    ...data.family,
    ...rest,
    ...(pin !== undefined ? { parentPin: hashPin(pin) } : {}),
    updatedAt: nowIso(),
  };
  saveData(data);
  return data.family;
}

export function verifyParentPin(pin) {
  const family = getFamily();
  if (!family) return false;
  return verifyPin(pin, family.parentPin);
}

// ─────────────────────────────────────────────
// Family pet (singleton)
// ─────────────────────────────────────────────

export function getFamilyPet() {
  return loadData().familyPet;
}

export function createFamilyPet({ petType, petName } = {}) {
  const data = loadData();
  const now = nowIso();
  data.familyPet = {
    id: genId(),
    familyId: data.family?.id ?? null,
    petType: petType ?? null,
    petName: petName ?? "",
    xp: 0,
    level: 1,
    mood: "happy",
    accessories: [],
    environment: "meadow",
    createdAt: now,
    updatedAt: now,
  };
  saveData(data);
  return data.familyPet;
}

export function updateFamilyPet(patch = {}) {
  const data = loadData();
  if (!data.familyPet) return null;
  data.familyPet = { ...data.familyPet, ...patch, updatedAt: nowIso() };
  saveData(data);
  return data.familyPet;
}

export function addFamilyPetXp(amount = 0) {
  const pet = getFamilyPet();
  if (!pet) return null;
  return updateFamilyPet({ xp: (pet.xp ?? 0) + Math.max(0, amount) });
}

// ─────────────────────────────────────────────
// High-level helpers (used by the UI)
// ─────────────────────────────────────────────

/** Create a child, hashing the optional PIN. */
export function createChild({ name, ageBracket, pin, avatarColor, interests } = {}) {
  const family = getFamily();
  return children.create({
    familyId: family?.id ?? null,
    name: name ?? "",
    ageBracket: ageBracket ?? "8-12",
    pin: pin ? hashPin(pin) : null,
    avatarColor: avatarColor ?? "#7DD3FC",
    interests: interests ?? [],
  });
}

/** Verify a child's PIN. Children without a PIN are always open. */
export function verifyChildPin(childId, pin) {
  const child = children.get(childId);
  if (!child) return false;
  return verifyPin(pin, child.pin);
}

export function createChildPet(childId, { petType, petName } = {}) {
  return childPets.create({ childId, petType, petName });
}

/** Each child has exactly one personal pet in Phase 1. */
export function getChildPet(childId) {
  return childPets.where((p) => p.childId === childId)[0] ?? null;
}

/** Create a child and their pet together; returns { child, pet }. */
export function createChildWithPet(childAttrs, petAttrs) {
  const child = createChild(childAttrs);
  const pet = createChildPet(child.id, petAttrs);
  return { child, pet };
}

/** Children joined with their pets — convenient for the home screen. */
export function listChildrenWithPets() {
  return children.list().map((child) => ({
    ...child,
    pet: getChildPet(child.id),
  }));
}
