/**
 * ChildWorld — a kid's personal space (Phase 1 stub).
 * Their pet, greeting, and XP/level. Today's Journey, chat, and growth wall
 * arrive in Phase 2+.
 */
import { useFamily } from "../context/FamilyContext.jsx";
import { useNav } from "../context/NavigationContext.jsx";
import { getPersonalPet } from "../data/pets.js";
import { levelProgress } from "../utils/xp.js";
import { MOOD_FACES } from "../data/pets.js";
import WorldScene from "../components/shared/WorldScene.jsx";
import ScreenHeader from "../components/shared/ScreenHeader.jsx";
import PetAvatar from "../components/pet/PetAvatar.jsx";
import XPBar from "../components/shared/XPBar.jsx";

export default function ChildWorld({ childId }) {
  const { children } = useFamily();
  const { reset } = useNav();
  const child = children.find((c) => c.id === childId);

  if (!child) {
    return (
      <WorldScene tone="day" className="min-h-screen">
        <ScreenHeader title="Hmm…" onBack={() => reset("home")} />
        <p className="px-8 text-ink/70">We couldn't find that world. Tap back to the home screen.</p>
      </WorldScene>
    );
  }

  const def = getPersonalPet(child.pet?.petType);
  const mood = MOOD_FACES[child.pet?.mood] ?? MOOD_FACES.happy;
  const { level } = levelProgress(child.pet?.xp ?? 0);

  return (
    <WorldScene tone="meadow" className="min-h-screen">
      <ScreenHeader title={`${child.name}'s World`} onBack={() => reset("home")} />

      <div className="mx-auto flex max-w-2xl flex-col items-center px-5 pb-16 text-center">
        <div className="relative mt-4">
          <PetAvatar
            petId={child.pet?.petType}
            icon={def?.icon ?? "🐾"}
            color={child.avatarColor}
            size="xl"
            pose="active"
            animate="idle"
          />
          <div className="absolute -right-1 top-1 rounded-full felt-surface px-2 py-1 text-2xl">
            {mood.face}
          </div>
        </div>

        <h2 className="mt-4 font-display text-3xl font-extrabold text-ink">
          {child.pet?.petName ?? "Your pet"}
        </h2>
        <p className="mt-1 max-w-md text-ink/70">
          “Hi {child.name}! I'm so happy you're here. {def?.personality ?? ""}”
        </p>

        <div className="mt-6 w-full max-w-sm rounded-4xl felt-surface p-5">
          <XPBar xp={child.pet?.xp ?? 0} color={child.avatarColor} label={`Level ${level}`} />
        </div>

        {/* Phase 2 placeholder */}
        <div className="mt-6 w-full max-w-sm rounded-4xl border-4 border-dashed border-ink/15 bg-white/40 p-6 text-ink/50">
          <div className="text-4xl">🗺️</div>
          <p className="mt-2 font-display font-extrabold">Today's Journey</p>
          <p className="text-sm">Your daily tasks land here next. Coming soon!</p>
        </div>
      </div>
    </WorldScene>
  );
}
