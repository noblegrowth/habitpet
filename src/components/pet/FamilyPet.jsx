/**
 * FamilyPet — the collective heart of the home screen (plan §pillar 5).
 * Big animated pet, mood face, name, and the family's shared XP bar.
 */
import PetAvatar from "./PetAvatar.jsx";
import XPBar from "../shared/XPBar.jsx";
import { getFamilyPet as lookupFamilyPet } from "../../data/pets.js";
import { MOOD_FACES } from "../../data/pets.js";

export default function FamilyPet({ pet }) {
  if (!pet) return null;
  const def = lookupFamilyPet(pet.petType);
  const mood = MOOD_FACES[pet.mood] ?? MOOD_FACES.happy;
  const color = "#7DD3FC";

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <PetAvatar icon={def?.icon ?? "🐾"} color={color} size="xl" animate="float" />
        {/* mood bubble */}
        <div className="absolute -right-2 top-2 rounded-full bg-white px-2 py-1 text-2xl shadow-soft">
          {mood.face}
        </div>
        {/* shadow on the grass */}
        <div className="mx-auto mt-2 h-3 w-32 rounded-full bg-ink/15 blur-sm" />
      </div>

      <h2 className="mt-3 font-display text-3xl font-extrabold text-ink drop-shadow-sm sm:text-4xl">
        {pet.petName}
      </h2>
      <p className="text-sm font-bold text-ink/60">
        {def?.name ?? "Family Pet"} · {mood.label}
      </p>

      <div className="mt-4 w-72 max-w-[80vw] rounded-4xl bg-white/70 p-4 shadow-soft backdrop-blur">
        <XPBar xp={pet.xp ?? 0} color={color} label={`Family · Level ${pet.level ?? 1}`} />
        <p className="mt-2 text-center text-xs font-semibold text-ink/50">
          Everyone helps {pet.petName} grow 💛
        </p>
      </div>
    </div>
  );
}
