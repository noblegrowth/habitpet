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
        "tap-target group flex flex-col items-center gap-2 rounded-4xl border-4 bg-white p-4 text-center transition active:scale-95",
        selected
          ? "border-sky-deep shadow-glow"
          : "border-transparent shadow-soft hover:border-sky-soft",
      ].join(" ")}
    >
      <PetAvatar
        icon={pet.icon}
        color={pet.color ?? "#7DD3FC"}
        size="md"
        animate={selected ? "bob" : "none"}
      />
      <div>
        <div className="font-display text-lg font-extrabold leading-tight text-ink">
          {pet.name}
        </div>
        <div className="text-xs font-semibold leading-snug text-ink/60">
          {pet.personality ?? pet.description}
        </div>
        {pet.bestFor && (
          <div className="mt-1 inline-block rounded-full bg-sky-soft/50 px-2 py-0.5 text-[11px] font-bold text-sky-deep">
            {pet.bestFor}
          </div>
        )}
      </div>
      {selected && <div className="text-sky-deep" aria-hidden>✓ Picked!</div>}
    </button>
  );
}
