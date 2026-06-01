/**
 * HabitPet — Task Template Library
 * Drop into /src/data/taskTemplates.js
 *
 * Structure:
 *   Each template has: id, title, category, subcategory, ageBrackets[],
 *   frequency, defaultXP, icon, requiresApproval, checkInWindows[],
 *   tags[], skillTreeNode (for future), characterTraits[]
 *
 * Usage:
 *   getTemplatesForChild(ageBracket, interests?) → filtered template list
 *   createTaskFromTemplate(templateId, childId, overrides?) → task object
 *   ingestVoiceOrTextGoal(rawText, childId) → structured task (AI-assisted)
 */

// ─────────────────────────────────────────────
// CATEGORIES
// ─────────────────────────────────────────────

export const CATEGORIES = {
  HYGIENE:      { id: "hygiene",      label: "Self-Care",       icon: "🧼", color: "#7DD3FC" },
  CHORES:       { id: "chores",       label: "Helping Out",     icon: "🏠", color: "#86EFAC" },
  SCHOOL:       { id: "school",       label: "Learning",        icon: "📚", color: "#FDE68A" },
  FITNESS:      { id: "fitness",      label: "Move It",         icon: "⚡", color: "#FCA5A5" },
  INTERESTS:    { id: "interests",    label: "My Passions",     icon: "🌟", color: "#C4B5FD" },
  CHARACTER:    { id: "character",    label: "Being Good",      icon: "❤️", color: "#FDA4AF" },
  FAMILY:       { id: "family",       label: "Family Time",     icon: "👨‍👩‍👧", color: "#6EE7B7" },
  REFLECTION:   { id: "reflection",   label: "Big Thoughts",    icon: "🌙", color: "#BAE6FD" },
  KID_GOAL:     { id: "kid_goal",     label: "My Own Goal",     icon: "🚀", color: "#FBCFE8" },
};

// ─────────────────────────────────────────────
// CHECK-IN WINDOWS
// ─────────────────────────────────────────────

export const CHECK_IN_WINDOWS = {
  WAKE_UP:       { id: "wake_up",        label: "Wake Up",         icon: "☀️", defaultTime: "07:00" },
  BEFORE_SCHOOL: { id: "before_school",  label: "Before School",   icon: "🎒", defaultTime: "07:45" },
  HOME_FROM_SCHOOL:{ id: "home",         label: "Home from School",icon: "🏃", defaultTime: "15:30" },
  MID_AFTERNOON: { id: "mid_afternoon",  label: "Afternoon",       icon: "🌤️", defaultTime: "16:30" },
  LAST_CHANCE:   { id: "last_chance",    label: "Last Chance",     icon: "⏰", defaultTime: "19:30" },
  BEDTIME:       { id: "bedtime",        label: "Bedtime",         icon: "🌙", defaultTime: "20:30" },
};

// ─────────────────────────────────────────────
// CHARACTER TRAITS (Fruits of the Spirit + extras)
// ─────────────────────────────────────────────

export const CHARACTER_TRAITS = {
  GRIT:          { id: "grit",          label: "Grit",         icon: "💪", description: "Keeps going when it's hard" },
  KINDNESS:      { id: "kindness",      label: "Kindness",     icon: "💛", description: "Makes others feel seen and valued" },
  FAITHFULNESS:  { id: "faithfulness",  label: "Faithfulness", icon: "🌟", description: "Shows up, even on hard days" },
  SELF_CONTROL:  { id: "self_control",  label: "Self-Control", icon: "🛡️", description: "Chooses what's right over what's easy" },
  JOY:           { id: "joy",           label: "Joy",          icon: "✨", description: "Brings light to their own day and others'" },
  PEACE:         { id: "peace",         label: "Peace",        icon: "🕊️", description: "Finds calm and helps others find it too" },
  GENEROSITY:    { id: "generosity",    label: "Generosity",   icon: "🎁", description: "Gives time, effort, and care freely" },
  TEAMWORK:      { id: "teamwork",      label: "Teamwork",     icon: "🤝", description: "Makes the group better" },
  WONDER:        { id: "wonder",        label: "Wonder",       icon: "🔭", description: "Curious and open to learning" },
  GROWTH_MINDSET:{ id: "growth_mindset",label: "Growth Mind",  icon: "🌱", description: "Sees challenges as opportunities" },
  COURTESY:      { id: "courtesy",      label: "Courtesy",     icon: "🎩", description: "Treats everyone with respect" },
  AMBITION:      { id: "ambition",      label: "Ambition",     icon: "🏔️", description: "Sets big goals and works toward them" },
};

// ─────────────────────────────────────────────
// SKILL TREE NODES (stub — for future Phase)
// ─────────────────────────────────────────────
// Each task can belong to a skill tree node.
// Completing enough tasks in a node unlocks the next tier.

export const SKILL_TREE_NODES = {
  // Self-Care Tree
  BASIC_HYGIENE:     { tier: 1, parent: null,           label: "Clean & Ready",     unlocksAt: 10 },
  SELF_CARE_ROUTINE: { tier: 2, parent: "BASIC_HYGIENE",label: "Solid Routine",     unlocksAt: 25 },
  WELLNESS_HABITS:   { tier: 3, parent: "SELF_CARE_ROUTINE", label: "Wellness Pro", unlocksAt: 50 },

  // Responsibility Tree
  SIMPLE_CHORES:     { tier: 1, parent: null,            label: "Helper",           unlocksAt: 10 },
  HOME_STEWARD:      { tier: 2, parent: "SIMPLE_CHORES", label: "Home Steward",     unlocksAt: 30 },
  FAMILY_ANCHOR:     { tier: 3, parent: "HOME_STEWARD",  label: "Family Anchor",    unlocksAt: 60 },

  // Learning Tree
  HOMEWORK_HABIT:    { tier: 1, parent: null,              label: "Study Starter",  unlocksAt: 10 },
  DEEP_LEARNER:      { tier: 2, parent: "HOMEWORK_HABIT",  label: "Deep Learner",   unlocksAt: 30 },
  SCHOLAR:           { tier: 3, parent: "DEEP_LEARNER",    label: "Scholar",        unlocksAt: 60 },

  // Character Tree
  KIND_ACTS:         { tier: 1, parent: null,           label: "Kind Heart",        unlocksAt: 8  },
  SERVANT_SPIRIT:    { tier: 2, parent: "KIND_ACTS",    label: "Servant Spirit",    unlocksAt: 20 },
  COMMUNITY_LIGHT:   { tier: 3, parent: "SERVANT_SPIRIT",label: "Community Light",  unlocksAt: 40 },
};

// ─────────────────────────────────────────────
// TASK TEMPLATES
// ─────────────────────────────────────────────

export const TASK_TEMPLATES = [

  // ── HYGIENE / SELF-CARE ──────────────────────────────────────

  {
    id: "brush_teeth_am",
    title: "Brush Teeth (Morning)",
    category: "hygiene",
    ageBrackets: ["4-7", "8-12", "13+"],
    frequency: "daily",
    defaultXP: { "4-7": 15, "8-12": 10, "13+": 8 },
    icon: "🪥",
    requiresApproval: false,
    checkInWindows: ["wake_up", "before_school"],
    tags: ["morning", "non-negotiable", "health"],
    characterTraits: ["self_control", "faithfulness"],
    skillTreeNode: "BASIC_HYGIENE",
  },
  {
    id: "brush_teeth_pm",
    title: "Brush Teeth (Bedtime)",
    category: "hygiene",
    ageBrackets: ["4-7", "8-12", "13+"],
    frequency: "daily",
    defaultXP: { "4-7": 15, "8-12": 10, "13+": 8 },
    icon: "🦷",
    requiresApproval: false,
    checkInWindows: ["bedtime"],
    tags: ["bedtime", "non-negotiable", "health"],
    characterTraits: ["self_control", "faithfulness"],
    skillTreeNode: "BASIC_HYGIENE",
  },
  {
    id: "make_bed",
    title: "Make My Bed",
    category: "hygiene",
    ageBrackets: ["4-7", "8-12", "13+"],
    frequency: "daily",
    defaultXP: { "4-7": 15, "8-12": 12, "13+": 10 },
    icon: "🛏️",
    requiresApproval: false,
    checkInWindows: ["wake_up", "before_school"],
    tags: ["morning", "order", "discipline"],
    characterTraits: ["self_control", "grit"],
    skillTreeNode: "BASIC_HYGIENE",
  },
  {
    id: "get_dressed",
    title: "Get Dressed on My Own",
    category: "hygiene",
    ageBrackets: ["4-7"],
    frequency: "daily",
    defaultXP: { "4-7": 20 },
    icon: "👕",
    requiresApproval: false,
    checkInWindows: ["wake_up", "before_school"],
    tags: ["morning", "independence"],
    characterTraits: ["self_control"],
    skillTreeNode: "BASIC_HYGIENE",
  },
  {
    id: "shower",
    title: "Shower / Bathe",
    category: "hygiene",
    ageBrackets: ["8-12", "13+"],
    frequency: "daily",
    defaultXP: { "8-12": 15, "13+": 12 },
    icon: "🚿",
    requiresApproval: false,
    checkInWindows: ["home", "bedtime"],
    tags: ["hygiene", "self-care"],
    characterTraits: ["self_control", "faithfulness"],
    skillTreeNode: "SELF_CARE_ROUTINE",
  },
  {
    id: "clean_room",
    title: "Tidy My Room",
    category: "hygiene",
    ageBrackets: ["4-7", "8-12", "13+"],
    frequency: "daily",
    defaultXP: { "4-7": 20, "8-12": 18, "13+": 15 },
    icon: "🧹",
    requiresApproval: true,
    checkInWindows: ["mid_afternoon", "last_chance"],
    tags: ["order", "home", "discipline"],
    characterTraits: ["self_control", "grit"],
    skillTreeNode: "BASIC_HYGIENE",
  },
  {
    id: "skincare",
    title: "Skincare Routine",
    category: "hygiene",
    ageBrackets: ["13+"],
    frequency: "daily",
    defaultXP: { "13+": 15 },
    icon: "✨",
    requiresApproval: false,
    checkInWindows: ["wake_up", "bedtime"],
    tags: ["self-care", "wellness"],
    characterTraits: ["self_control", "faithfulness"],
    skillTreeNode: "WELLNESS_HABITS",
  },
  {
    id: "healthy_breakfast",
    title: "Eat a Healthy Breakfast",
    category: "hygiene",
    ageBrackets: ["4-7", "8-12", "13+"],
    frequency: "daily",
    defaultXP: { "4-7": 15, "8-12": 12, "13+": 10 },
    icon: "🥣",
    requiresApproval: false,
    checkInWindows: ["wake_up", "before_school"],
    tags: ["morning", "health", "nutrition"],
    characterTraits: ["self_control"],
    skillTreeNode: "WELLNESS_HABITS",
  },

  // ── CHORES ───────────────────────────────────────────────────

  {
    id: "collect_bedroom_trash",
    title: "Collect Bedroom Trash",
    category: "chores",
    ageBrackets: ["4-7", "8-12", "13+"],
    frequency: "weekly",
    defaultXP: { "4-7": 20, "8-12": 18, "13+": 15 },
    icon: "🗑️",
    requiresApproval: true,
    checkInWindows: ["mid_afternoon", "last_chance"],
    tags: ["home", "chore", "family-contribution"],
    characterTraits: ["faithfulness", "teamwork"],
    skillTreeNode: "SIMPLE_CHORES",
  },
  {
    id: "sort_laundry",
    title: "Sort / Collect Laundry",
    category: "chores",
    ageBrackets: ["4-7", "8-12", "13+"],
    frequency: "weekly",
    defaultXP: { "4-7": 20, "8-12": 18, "13+": 15 },
    icon: "👕",
    requiresApproval: true,
    checkInWindows: ["mid_afternoon", "last_chance"],
    tags: ["home", "chore", "family-contribution"],
    characterTraits: ["teamwork", "faithfulness"],
    skillTreeNode: "SIMPLE_CHORES",
  },
  {
    id: "unload_dishwasher",
    title: "Unload the Dishwasher",
    category: "chores",
    ageBrackets: ["8-12", "13+"],
    frequency: "daily",
    defaultXP: { "8-12": 20, "13+": 18 },
    icon: "🍽️",
    requiresApproval: true,
    checkInWindows: ["home", "mid_afternoon"],
    tags: ["home", "chore", "family-contribution"],
    characterTraits: ["teamwork", "generosity"],
    skillTreeNode: "HOME_STEWARD",
  },
  {
    id: "set_table",
    title: "Set the Table",
    category: "chores",
    ageBrackets: ["4-7", "8-12"],
    frequency: "daily",
    defaultXP: { "4-7": 15, "8-12": 12 },
    icon: "🍴",
    requiresApproval: true,
    checkInWindows: ["mid_afternoon", "last_chance"],
    tags: ["home", "family-contribution", "courtesy"],
    characterTraits: ["teamwork", "courtesy", "generosity"],
    skillTreeNode: "SIMPLE_CHORES",
  },
  {
    id: "feed_pet",
    title: "Feed / Care for Family Pet",
    category: "chores",
    ageBrackets: ["4-7", "8-12", "13+"],
    frequency: "daily",
    defaultXP: { "4-7": 20, "8-12": 18, "13+": 15 },
    icon: "🐾",
    requiresApproval: false,
    checkInWindows: ["wake_up", "home", "bedtime"],
    tags: ["home", "family-contribution", "responsibility"],
    characterTraits: ["faithfulness", "kindness", "teamwork"],
    skillTreeNode: "HOME_STEWARD",
  },
  {
    id: "take_out_trash",
    title: "Take Out the Trash",
    category: "chores",
    ageBrackets: ["13+"],
    frequency: "weekly",
    defaultXP: { "13+": 25 },
    icon: "♻️",
    requiresApproval: true,
    checkInWindows: ["mid_afternoon", "last_chance"],
    tags: ["home", "chore", "ownership"],
    characterTraits: ["faithfulness", "teamwork"],
    skillTreeNode: "FAMILY_ANCHOR",
  },
  {
    id: "wipe_counter",
    title: "Wipe Down the Counter",
    category: "chores",
    ageBrackets: ["8-12", "13+"],
    frequency: "daily",
    defaultXP: { "8-12": 15, "13+": 12 },
    icon: "🧽",
    requiresApproval: true,
    checkInWindows: ["mid_afternoon", "last_chance"],
    tags: ["home", "chore"],
    characterTraits: ["teamwork", "self_control"],
    skillTreeNode: "HOME_STEWARD",
  },
  {
    id: "help_without_asking",
    title: "Help Someone Without Being Asked",
    category: "chores",
    ageBrackets: ["4-7", "8-12", "13+"],
    frequency: "daily",
    defaultXP: { "4-7": 25, "8-12": 25, "13+": 25 },
    icon: "🙌",
    requiresApproval: true,
    checkInWindows: ["mid_afternoon", "last_chance", "bedtime"],
    tags: ["character", "family-contribution", "bonus"],
    characterTraits: ["kindness", "generosity", "teamwork", "servant_spirit"],
    skillTreeNode: "KIND_ACTS",
    isBonus: true,
    bonusMultiplier: 1.5,
  },

  // ── SCHOOL / LEARNING ────────────────────────────────────────

  {
    id: "homework_done",
    title: "Finish Homework",
    category: "school",
    ageBrackets: ["4-7", "8-12", "13+"],
    frequency: "weekday",
    defaultXP: { "4-7": 25, "8-12": 30, "13+": 35 },
    icon: "📝",
    requiresApproval: true,
    checkInWindows: ["home", "mid_afternoon", "last_chance"],
    tags: ["school", "discipline", "growth"],
    characterTraits: ["grit", "faithfulness", "self_control"],
    skillTreeNode: "HOMEWORK_HABIT",
  },
  {
    id: "reading_time",
    title: "Independent Reading (20 min)",
    category: "school",
    ageBrackets: ["4-7", "8-12", "13+"],
    frequency: "daily",
    defaultXP: { "4-7": 20, "8-12": 25, "13+": 25 },
    icon: "📖",
    requiresApproval: false,
    checkInWindows: ["home", "mid_afternoon", "bedtime"],
    tags: ["school", "growth", "wonder"],
    characterTraits: ["wonder", "growth_mindset", "self_control"],
    skillTreeNode: "DEEP_LEARNER",
  },
  {
    id: "test_prep",
    title: "Study for a Test",
    category: "school",
    ageBrackets: ["8-12", "13+"],
    frequency: "as-needed",
    defaultXP: { "8-12": 35, "13+": 40 },
    icon: "🧠",
    requiresApproval: true,
    checkInWindows: ["home", "mid_afternoon", "last_chance"],
    tags: ["school", "discipline", "growth", "grit"],
    characterTraits: ["grit", "self_control", "growth_mindset"],
    skillTreeNode: "DEEP_LEARNER",
  },
  {
    id: "project_work",
    title: "Work on a School Project",
    category: "school",
    ageBrackets: ["8-12", "13+"],
    frequency: "as-needed",
    defaultXP: { "8-12": 35, "13+": 45 },
    icon: "📐",
    requiresApproval: true,
    checkInWindows: ["home", "mid_afternoon"],
    tags: ["school", "discipline", "creativity"],
    characterTraits: ["grit", "growth_mindset", "ambition"],
    skillTreeNode: "SCHOLAR",
  },
  {
    id: "school_reflection",
    title: "Tell Me One Thing You Learned Today",
    category: "school",
    ageBrackets: ["4-7", "8-12", "13+"],
    frequency: "weekday",
    defaultXP: { "4-7": 15, "8-12": 15, "13+": 20 },
    icon: "💡",
    requiresApproval: false,
    checkInWindows: ["home", "bedtime"],
    notes: "Child narrates to pet via chat — AI responds with curiosity.",
    tags: ["school", "reflection", "wonder"],
    characterTraits: ["wonder", "growth_mindset"],
    skillTreeNode: "HOMEWORK_HABIT",
  },
  {
    id: "pack_backpack",
    title: "Pack My Backpack for Tomorrow",
    category: "school",
    ageBrackets: ["4-7", "8-12"],
    frequency: "weekday",
    defaultXP: { "4-7": 15, "8-12": 12 },
    icon: "🎒",
    requiresApproval: false,
    checkInWindows: ["last_chance", "bedtime"],
    tags: ["school", "preparation", "independence"],
    characterTraits: ["self_control", "faithfulness"],
    skillTreeNode: "HOMEWORK_HABIT",
  },

  // ── FITNESS / SPORTS ─────────────────────────────────────────

  {
    id: "sports_practice",
    title: "Sports Practice (Team)",
    category: "fitness",
    ageBrackets: ["4-7", "8-12", "13+"],
    frequency: "as-needed",
    defaultXP: { "4-7": 30, "8-12": 35, "13+": 40 },
    icon: "⚽",
    requiresApproval: false,
    checkInWindows: ["mid_afternoon", "last_chance"],
    tags: ["fitness", "team", "discipline"],
    characterTraits: ["grit", "teamwork", "faithfulness"],
    skillTreeNode: null,
    isCustomizable: true,
    customFields: ["sport"],
  },
  {
    id: "solo_practice",
    title: "Practice [Sport/Skill] on My Own",
    category: "fitness",
    ageBrackets: ["8-12", "13+"],
    frequency: "daily",
    defaultXP: { "8-12": 30, "13+": 35 },
    icon: "🏃",
    requiresApproval: false,
    checkInWindows: ["home", "mid_afternoon"],
    tags: ["fitness", "growth", "grit", "between-practices"],
    characterTraits: ["grit", "ambition", "self_control"],
    isCustomizable: true,
    customFields: ["sport", "duration"],
  },
  {
    id: "movement_break",
    title: "Get Outside / Move My Body",
    category: "fitness",
    ageBrackets: ["4-7", "8-12"],
    frequency: "daily",
    defaultXP: { "4-7": 15, "8-12": 15 },
    icon: "🌳",
    requiresApproval: false,
    checkInWindows: ["home", "mid_afternoon"],
    tags: ["fitness", "health", "play"],
    characterTraits: ["joy", "self_control"],
  },
  {
    id: "stretch_or_yoga",
    title: "Stretch / Wind-Down Movement",
    category: "fitness",
    ageBrackets: ["8-12", "13+"],
    frequency: "daily",
    defaultXP: { "8-12": 15, "13+": 15 },
    icon: "🧘",
    requiresApproval: false,
    checkInWindows: ["bedtime"],
    tags: ["fitness", "wellness", "calm"],
    characterTraits: ["peace", "self_control"],
    skillTreeNode: "WELLNESS_HABITS",
  },

  // ── INTERESTS / SKILLS ────────────────────────────────────────

  {
    id: "instrument_practice",
    title: "Practice My Instrument",
    category: "interests",
    ageBrackets: ["4-7", "8-12", "13+"],
    frequency: "daily",
    defaultXP: { "4-7": 25, "8-12": 30, "13+": 35 },
    icon: "🎵",
    requiresApproval: false,
    checkInWindows: ["home", "mid_afternoon"],
    tags: ["interest", "skill", "discipline"],
    characterTraits: ["grit", "faithfulness", "ambition"],
    isCustomizable: true,
    customFields: ["instrument"],
  },
  {
    id: "art_time",
    title: "Create Something (Art / Drawing)",
    category: "interests",
    ageBrackets: ["4-7", "8-12", "13+"],
    frequency: "daily",
    defaultXP: { "4-7": 20, "8-12": 20, "13+": 20 },
    icon: "🎨",
    requiresApproval: false,
    checkInWindows: ["home", "mid_afternoon", "bedtime"],
    tags: ["interest", "creativity", "wonder"],
    characterTraits: ["wonder", "joy", "growth_mindset"],
  },
  {
    id: "coding_time",
    title: "Coding / Building Something Digital",
    category: "interests",
    ageBrackets: ["8-12", "13+"],
    frequency: "daily",
    defaultXP: { "8-12": 25, "13+": 30 },
    icon: "💻",
    requiresApproval: false,
    checkInWindows: ["home", "mid_afternoon"],
    tags: ["interest", "skill", "growth", "technology"],
    characterTraits: ["wonder", "ambition", "growth_mindset"],
  },
  {
    id: "explore_something_new",
    title: "Discover / Explore Something New",
    category: "interests",
    ageBrackets: ["4-7", "8-12", "13+"],
    frequency: "weekly",
    defaultXP: { "4-7": 20, "8-12": 25, "13+": 30 },
    icon: "🔭",
    requiresApproval: false,
    checkInWindows: ["mid_afternoon", "last_chance"],
    notes: "Open-ended. Kid tells pet what they explored via chat.",
    tags: ["wonder", "exploration", "growth"],
    characterTraits: ["wonder", "growth_mindset", "joy"],
  },

  // ── CHARACTER / VALUES ────────────────────────────────────────

  {
    id: "kind_act",
    title: "Do Something Kind for Someone",
    category: "character",
    ageBrackets: ["4-7", "8-12", "13+"],
    frequency: "daily",
    defaultXP: { "4-7": 25, "8-12": 25, "13+": 25 },
    icon: "💛",
    requiresApproval: true,
    checkInWindows: ["mid_afternoon", "last_chance", "bedtime"],
    tags: ["character", "kindness", "bonus"],
    characterTraits: ["kindness", "generosity", "courtesy"],
    skillTreeNode: "KIND_ACTS",
    isBonus: true,
    bonusMultiplier: 1.5,
  },
  {
    id: "encourage_sibling",
    title: "Encourage or Help a Sibling",
    category: "character",
    ageBrackets: ["4-7", "8-12", "13+"],
    frequency: "daily",
    defaultXP: { "4-7": 25, "8-12": 25, "13+": 25 },
    icon: "🤝",
    requiresApproval: true,
    checkInWindows: ["mid_afternoon", "last_chance"],
    tags: ["character", "family", "teamwork"],
    characterTraits: ["kindness", "teamwork", "generosity", "courtesy"],
    skillTreeNode: "KIND_ACTS",
    isBonus: true,
  },
  {
    id: "gratitude_moment",
    title: "Name 3 Things I'm Grateful For",
    category: "reflection",
    ageBrackets: ["4-7", "8-12", "13+"],
    frequency: "daily",
    defaultXP: { "4-7": 15, "8-12": 15, "13+": 20 },
    icon: "🙏",
    requiresApproval: false,
    checkInWindows: ["bedtime"],
    notes: "Kid tells pet via chat. AI acknowledges and reflects back.",
    tags: ["reflection", "peace", "character"],
    characterTraits: ["peace", "joy", "faithfulness"],
    skillTreeNode: "COMMUNITY_LIGHT",
  },
  {
    id: "say_sorry_or_make_right",
    title: "Apologize or Make Something Right",
    category: "character",
    ageBrackets: ["4-7", "8-12", "13+"],
    frequency: "as-needed",
    defaultXP: { "4-7": 30, "8-12": 35, "13+": 40 },
    icon: "🕊️",
    requiresApproval: true,
    checkInWindows: ["mid_afternoon", "last_chance", "bedtime"],
    tags: ["character", "courage", "growth"],
    characterTraits: ["peace", "courtesy", "grit"],
    isBonus: true,
    bonusMultiplier: 2.0,
    notes: "High XP because this takes courage. Always parent-approved.",
  },
  {
    id: "screen_time_limit",
    title: "Stayed Within Screen Time Limit",
    category: "character",
    ageBrackets: ["8-12", "13+"],
    frequency: "daily",
    defaultXP: { "8-12": 20, "13+": 25 },
    icon: "📱",
    requiresApproval: true,
    checkInWindows: ["bedtime"],
    tags: ["self-control", "discipline", "character"],
    characterTraits: ["self_control", "grit"],
  },

  // ── FAMILY ────────────────────────────────────────────────────

  {
    id: "family_dinner",
    title: "Be Present at Family Dinner",
    category: "family",
    ageBrackets: ["4-7", "8-12", "13+"],
    frequency: "daily",
    defaultXP: { "4-7": 15, "8-12": 15, "13+": 20 },
    icon: "🍽️",
    requiresApproval: false,
    checkInWindows: ["last_chance"],
    tags: ["family", "connection", "courtesy"],
    characterTraits: ["courtesy", "teamwork", "peace"],
  },
  {
    id: "family_game_or_activity",
    title: "Family Game / Activity",
    category: "family",
    ageBrackets: ["4-7", "8-12", "13+"],
    frequency: "weekly",
    defaultXP: { "4-7": 30, "8-12": 25, "13+": 20 },
    icon: "🎲",
    requiresApproval: false,
    checkInWindows: ["mid_afternoon", "last_chance"],
    tags: ["family", "connection", "joy"],
    characterTraits: ["joy", "teamwork", "courtesy"],
    feedsFamilyPet: true,
    familyPetXP: 30,
  },
  {
    id: "feed_family_pet",
    title: "Feed the Family Pet",
    category: "family",
    ageBrackets: ["4-7", "8-12", "13+"],
    frequency: "daily",
    defaultXP: { "4-7": 15, "8-12": 12, "13+": 10 },
    icon: "🐾",
    requiresApproval: false,
    checkInWindows: ["wake_up", "bedtime"],
    tags: ["family", "responsibility", "chore"],
    characterTraits: ["faithfulness", "kindness"],
    feedsFamilyPet: true,
    familyPetXP: 15,
  },
  {
    id: "family_contribution_task",
    title: "Complete Today's Family Contribution",
    category: "family",
    ageBrackets: ["4-7", "8-12", "13+"],
    frequency: "daily",
    defaultXP: { "4-7": 20, "8-12": 20, "13+": 20 },
    icon: "👨‍👩‍👧",
    requiresApproval: true,
    checkInWindows: ["mid_afternoon", "last_chance"],
    tags: ["family", "teamwork", "chore"],
    characterTraits: ["teamwork", "generosity", "faithfulness"],
    feedsFamilyPet: true,
    familyPetXP: 20,
    notes: "Parent sets the specific task. This is the 'family team task' slot.",
  },

  // ── WEEKLY REFLECTION ──────────────────────────────────────────

  {
    id: "weekly_reflection",
    title: "Weekly Reflection with [Pet]",
    category: "reflection",
    ageBrackets: ["4-7", "8-12", "13+"],
    frequency: "weekly",
    defaultXP: { "4-7": 40, "8-12": 50, "13+": 60 },
    icon: "🌙",
    requiresApproval: false,
    checkInWindows: ["mid_afternoon", "last_chance"],
    availableFrom: "sunday_morning",
    nudgeDeadline: "tuesday_evening",
    tags: ["reflection", "growth", "weekly"],
    characterTraits: ["growth_mindset", "peace", "faithfulness"],
    notes: "3-phase: report → child response → reframe. See AI prompt WEEKLY_REFLECTION mode.",
  },
];

// ─────────────────────────────────────────────
// FAMILY PET OPTIONS
// ─────────────────────────────────────────────

export const FAMILY_PET_OPTIONS = [
  { id: "phoenix",     name: "Phoenix",      icon: "🦅", description: "Rises together — symbolizes family renewal and shared effort", defaultName: "Ember" },
  { id: "lizard",      name: "Lizard",        icon: "🦎", description: "Patient, ancient wisdom, loves warm sunny vibes",              defaultName: "Sunny" },
  { id: "capybara",    name: "Capybara",      icon: "🦫", description: "The chill, beloved friend of everyone — team energy",         defaultName: "Capy" },
  { id: "snow_leopard",name: "Snow Leopard",  icon: "🐆", description: "Graceful, rare, and powerful — only seen when you've earned it", defaultName: "Storm" },
  { id: "elephant",    name: "Elephant",      icon: "🐘", description: "Strong memory, deep family bonds, gentle giant",              defaultName: "Titan" },
  { id: "whale",       name: "Whale",         icon: "🐋", description: "Majestic, calm, sings together — oceanic family vibes",       defaultName: "Atlas" },
  { id: "red_panda",   name: "Red Panda",     icon: "🐼", description: "Adorable, quirky, surprisingly capable",                     defaultName: "Roo" },
  { id: "otter",       name: "Otter",         icon: "🦦", description: "Playful, holds hands with family, always together",          defaultName: "Pip" },
  { id: "manta_ray",   name: "Manta Ray",     icon: "🐟", description: "Glides effortlessly — calm power through consistency",       defaultName: "Ray" },
];

// ─────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────

/**
 * Returns age-appropriate templates, optionally filtered by category
 */
export function getTemplatesForChild(ageBracket, category = null) {
  return TASK_TEMPLATES.filter(t =>
    t.ageBrackets.includes(ageBracket) &&
    (category === null || t.category === category)
  );
}

/**
 * Returns the default task set for onboarding a new child
 * Selects essential non-negotiables + a few category representatives
 */
export function getOnboardingDefaults(ageBracket) {
  const essentials = ["brush_teeth_am", "brush_teeth_pm", "make_bed", "homework_done", "kind_act", "weekly_reflection", "gratitude_moment"];
  return TASK_TEMPLATES.filter(t =>
    essentials.includes(t.id) && t.ageBrackets.includes(ageBracket)
  );
}

/**
 * Creates a task instance from a template
 */
export function createTaskFromTemplate(templateId, childId, overrides = {}) {
  const template = TASK_TEMPLATES.find(t => t.id === templateId);
  if (!template) throw new Error(`Template not found: ${templateId}`);

  return {
    id: `${childId}_${templateId}_${Date.now()}`,
    childId,
    templateId,
    title: overrides.title || template.title,
    category: template.category,
    frequency: overrides.frequency || template.frequency,
    xpValue: overrides.xpValue || template.defaultXP,
    icon: template.icon,
    requiresApproval: overrides.requiresApproval ?? template.requiresApproval,
    checkInWindows: template.checkInWindows,
    characterTraits: template.characterTraits,
    skillTreeNode: template.skillTreeNode || null,
    isBonus: template.isBonus || false,
    bonusMultiplier: template.bonusMultiplier || 1.0,
    feedsFamilyPet: template.feedsFamilyPet || false,
    familyPetXP: template.familyPetXP || 0,
    completedDates: [],
    createdAt: new Date().toISOString(),
    isKidInitiated: false,
    ...overrides,
  };
}

/**
 * Creates a kid-initiated or parent-custom task (not from template)
 * These get a bonus XP multiplier and special badge
 */
export function createCustomTask(childId, { title, category, frequency, xpValue, ageBracket, isKidInitiated = false }) {
  const BASE_XP = { "4-7": 20, "8-12": 25, "13+": 30 };
  const kidBonus = isKidInitiated ? 1.5 : 1.0;

  return {
    id: `${childId}_custom_${Date.now()}`,
    childId,
    templateId: null,
    title,
    category: category || "kid_goal",
    frequency: frequency || "daily",
    xpValue: xpValue || Math.round((BASE_XP[ageBracket] || 25) * kidBonus),
    icon: isKidInitiated ? "🚀" : "⭐",
    requiresApproval: true,
    checkInWindows: ["mid_afternoon", "last_chance"],
    characterTraits: ["ambition", "grit"],
    skillTreeNode: null,
    isBonus: false,
    feedsFamilyPet: false,
    isKidInitiated,
    kidInitiatedBonus: isKidInitiated,
    completedDates: [],
    createdAt: new Date().toISOString(),
    pendingParentReview: isKidInitiated,
  };
}

/**
 * XP thresholds for reward celebrations
 * Parents can customize these per child
 */
export const DEFAULT_XP_THRESHOLDS = [
  { xp: 100,   label: "First Century",   reward: "Unlock new pet accessory",         icon: "🎖️" },
  { xp: 250,   label: "Building Steam",  reward: "Pet room decoration unlock",        icon: "⭐" },
  { xp: 500,   label: "Halfway Hero",    reward: "Choose a special family activity",  icon: "🏆" },
  { xp: 1000,  label: "Four Digits",     reward: "Customize pet name",                icon: "👑" },
  { xp: 2500,  label: "Grind Master",    reward: "Unlock rare pet accessory",         icon: "💎" },
  { xp: 5000,  label: "Habit Legend",    reward: "Family celebration (parent-defined)", icon: "🌟" },
];

export const STREAK_THRESHOLDS = [
  { days: 3,   label: "3-Day Spark",     trait: "faithfulness", icon: "🔥"  },
  { days: 7,   label: "1-Week Warrior",  trait: "grit",         icon: "⚔️"  },
  { days: 14,  label: "Two-Week Titan",  trait: "self_control", icon: "🛡️"  },
  { days: 30,  label: "Month of Might",  trait: "ambition",     icon: "🏔️"  },
  { days: 100, label: "Century Club",    trait: "faithfulness", icon: "💯"  },
];

export default {
  CATEGORIES,
  CHECK_IN_WINDOWS,
  CHARACTER_TRAITS,
  SKILL_TREE_NODES,
  TASK_TEMPLATES,
  FAMILY_PET_OPTIONS,
  getTemplatesForChild,
  getOnboardingDefaults,
  createTaskFromTemplate,
  createCustomTask,
  DEFAULT_XP_THRESHOLDS,
  STREAK_THRESHOLDS,
};
