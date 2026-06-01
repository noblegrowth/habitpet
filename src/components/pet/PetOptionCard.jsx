/**
 * PetOptionCard — a selectable pet in the chooser grids (personal + family).
 */
import PetAvatar from "./PetAvatar.jsx";

export default function PetOptionCard({ pet, selected = false, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(pet)}
      aria-pressed={selected}
      className={[
        "tap-target group flex flex-col items-center gap-2 rounded-4xl border-4 felt-surface p-4 text-center transition active:scale-95",
        selected
          ? "border-coral-deep shadow-glow"
          : "border-transparent hover:border-coral-soft",
      ].join(" ")}
    >
      <PetAvatar
        petId={pet.id}
        icon={pet.icon}
        color={pet.color ?? "#9DB7C0"}
        size="md"
        pose="face"
        animate={selected ? "hop" : "none"}
      />
      <div>
        <div className="font-display text-lg font-extrabold leading-tight text-ink">
          {pet.name}
        </div>
        <div className="text-xs font-semibold leading-snug text-ink/60">
          {pet.personality ?? pet.description}
        </div>
        {pet.bestFor && (
          <div className="mt-1 inline-block rounded-full bg-coral-soft/50 px-2 py-0.5 text-[11px] font-bold text-coral-deep">
            {pet.bestFor}
          </div>
        )}
      </div>
      {selected && <div className="font-bold text-coral-deep" aria-hidden>✓ Picked!</div>}
    </button>
  );
}
