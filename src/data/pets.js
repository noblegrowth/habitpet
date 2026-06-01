/**
 * HabitPet — Pet Roster & Onboarding Constants
 *
 * Personal pets (one per child) live here. Family pets are defined in
 * /src/data/habitpet-task-templates.js (FAMILY_PET_OPTIONS) and re-exported
 * below so UI code has a single import site for "all the pets".
 */

import { FAMILY_PET_OPTIONS } from "./habitpet-task-templates.js";

// ─────────────────────────────────────────────
// PERSONAL PETS (one per child)
// Personalities mirror the project plan (§5 The Pet System).
// ─────────────────────────────────────────────

export const PERSONAL_PET_OPTIONS = [
  { id: "dragon",  name: "Dragon",  icon: "🐉", personality: "Bold, brave, challenge-hungry",  bestFor: "Competitive kids",     defaultName: "Blaze",   color: "#FCA5A5" },
  { id: "fox",     name: "Fox",     icon: "🦊", personality: "Clever, curious, witty",          bestFor: "Curious minds",        defaultName: "Rusty",   color: "#FDBA74" },
  { id: "bunny",   name: "Bunny",   icon: "🐰", personality: "Sweet, gentle, nurturing",        bestFor: "Gentle hearts",        defaultName: "Clover",  color: "#FBCFE8" },
  { id: "owl",     name: "Owl",     icon: "🦉", personality: "Wise, calm, thoughtful",          bestFor: "Deep thinkers",        defaultName: "Sage",    color: "#C4B5FD" },
  { id: "puppy",   name: "Puppy",   icon: "🐶", personality: "Loyal, enthusiastic, energetic",  bestFor: "Social butterflies",   defaultName: "Scout",   color: "#FDE68A" },
  { id: "kitten",  name: "Kitten",  icon: "🐱", personality: "Sassy, independent, charming",    bestFor: "Strong wills",         defaultName: "Mittens", color: "#FCD34D" },
  { id: "hamster", name: "Hamster", icon: "🐹", personality: "Scrappy, funny, determined",      bestFor: "Underdog lovers",      defaultName: "Nugget",  color: "#FDE047" },
  { id: "bee",     name: "Bee",     icon: "🐝", personality: "Hardworking, community-minded",   bestFor: "Diligent helpers",     defaultName: "Buzz",    color: "#FACC15" },
  { id: "unicorn", name: "Unicorn", icon: "🦄", personality: "Magical, expressive, joyful",     bestFor: "Big imaginations",     defaultName: "Sparkle", color: "#F0ABFC" },
];

// Re-export so consumers can grab both rosters from one place.
export { FAMILY_PET_OPTIONS };

// ─────────────────────────────────────────────
// AGE BRACKETS (match schema CHECK constraint: '4-7','8-12','13+')
// ─────────────────────────────────────────────

export const AGE_BRACKETS = [
  { id: "4-7",  label: "4–7",  emoji: "🧸", blurb: "Little explorer" },
  { id: "8-12", label: "8–12", emoji: "🚀", blurb: "Big kid energy" },
  { id: "13+",  label: "13+",  emoji: "🎧", blurb: "Almost grown" },
];

// ─────────────────────────────────────────────
// AVATAR COLORS (child tile / accent color)
// ─────────────────────────────────────────────

export const AVATAR_COLORS = [
  "#7DD3FC", // sky
  "#86EFAC", // grass
  "#FDE68A", // golden
  "#FCA5A5", // coral
  "#C4B5FD", // grape
  "#F0ABFC", // orchid
  "#FDBA74", // peach
  "#5EEAD4", // teal
];

// ─────────────────────────────────────────────
// MOOD → FACE map (pet mood states, plan §5)
// ─────────────────────────────────────────────

export const MOOD_FACES = {
  thriving:   { face: "😄", label: "Thriving" },
  happy:      { face: "😊", label: "Happy" },
  okay:       { face: "😐", label: "Okay" },
  tired:      { face: "😴", label: "Tired" },
  struggling: { face: "😔", label: "Struggling" },
};

// Lookup helpers --------------------------------------------------------------

export function getPersonalPet(id) {
  return PERSONAL_PET_OPTIONS.find((p) => p.id === id) ?? null;
}

export function getFamilyPet(id) {
  return FAMILY_PET_OPTIONS.find((p) => p.id === id) ?? null;
}
