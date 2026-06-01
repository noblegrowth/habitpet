/**
 * FamilyPet — the collective heart of the home screen (plan §pillar 5).
 * Felted hero pet, mood chip, name, and the family's shared XP bar.
 */
import PetAvatar from "./PetAvatar.jsx";
import XPBar from "../shared/XPBar.jsx";
import { getFamilyPet as lookupFamilyPet, MOOD_FACES } from "../../data/pets.js";

export default function FamilyPet({ pet }) {
  if (!pet) return null;
  const def = lookupFamilyPet(pet.petType);
  const mood = MOOD_FACES[pet.mood] ?? MOOD_FACES.happy;
  const color = "#C27457"; // terracotta wool accent for the family pet

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <PetAvatar
          petId={pet.petType}
          icon={def?.icon ?? "🐾"}
          color={color}
          size="xl"
          pose="active"
          animate="idle"
        />
        {/* mood chip — matte felt */}
        <div className="absolute -right-1 top-1 rounded-full felt-surface px-2 py-1 text-2xl">
          {mood.face}
        </div>
      </div>

      <h2 className="mt-3 font-display text-3xl font-extrabold text-ink sm:text-4xl">
        {pet.petName}
      </h2>
      <p className="text-sm font-bold text-ink/60">
        {def?.name ?? "Family Pet"} · {mood.label}
      </p>

      <div className="mt-4 w-72 max-w-[80vw] rounded-4xl felt-surface p-4">
        <XPBar xp={pet.xp ?? 0} color={color} label={`Family · Level ${pet.level ?? 1}`} />
        <p className="mt-2 text-center text-xs font-semibold text-ink/50">
          Everyone helps {pet.petName} grow 💛
        </p>
      </div>
    </div>
  );
}
