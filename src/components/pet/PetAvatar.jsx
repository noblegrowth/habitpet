/**
 * PetAvatar — a needle-felted pet rendered with a soft contact shadow so it
 * reads as a physical object (see docs/DESIGN_SYSTEM.md).
 *
 * Asset pipeline: if `src/assets/pets/{petId}-{pose}.png` exists it's loaded
 * automatically; otherwise we show the emoji on a matte felt medallion. Drop in
 * art with the right filename and it appears — no code change needed.
 *
 * `pose`:  "face" (avatar) · "active" (task/reward) · "contextual" (diorama)
 * `animate`: "idle" (stepped breathe) · "hop" (bouncier) · "none"
 */

// Eagerly map every felted PNG to its URL at build time.
const PET_ART = import.meta.glob("../../assets/pets/*.png", {
  eager: true,
  query: "?url",
  import: "default",
});

function artUrl(petId, pose) {
  if (!petId) return null;
  return PET_ART[`../../assets/pets/${petId}-${pose}.png`] ?? null;
}

const SIZES = {
  sm: { box: "h-14 w-14", emoji: "text-3xl", shadow: "h-1.5 w-9" },
  md: { box: "h-24 w-24", emoji: "text-5xl", shadow: "h-2 w-14" },
  lg: { box: "h-36 w-36", emoji: "text-7xl", shadow: "h-2.5 w-24" },
  xl: {
    box: "h-52 w-52 sm:h-60 sm:w-60",
    emoji: "text-8xl sm:text-9xl",
    shadow: "h-3 w-32 sm:w-40",
  },
};

const ANIM = {
  idle: "animate-felt-idle",
  hop: "animate-felt-hop",
  none: "",
};

export default function PetAvatar({
  petId,
  icon = "🐾",
  color = "#9DB7C0",
  size = "md",
  pose = "face",
  animate = "idle",
  className = "",
}) {
  const s = SIZES[size] ?? SIZES.md;
  const anim = ANIM[animate] ?? ANIM.idle;
  const url = artUrl(petId, pose);

  return (
    <div className={`relative inline-flex flex-col items-center ${className}`}>
      <div className={anim}>
        {url ? (
          <img
            src={url}
            alt=""
            className={`${s.box} object-contain drop-shadow-[0_10px_8px_rgba(74,64,54,0.25)]`}
          />
        ) : (
          <FeltMedallion size={s} color={color} icon={icon} />
        )}
      </div>
      {/* warm ambient-occlusion contact shadow → weight / physical presence */}
      <span
        className={`mt-1 rounded-[50%] bg-ink/30 blur-md ${s.shadow}`}
        aria-hidden
      />
    </div>
  );
}

/** Matte felt "wool ball" holding the emoji — top light, bottom occlusion, no gloss. */
function FeltMedallion({ size, color, icon }) {
  return (
    <div
      className={`flex items-center justify-center rounded-full ${size.box}`}
      style={{
        backgroundColor: "#F2E9D8",
        boxShadow: [
          "inset 0 -7px 14px rgba(74,64,54,0.20)", // bottom occlusion
          "inset 0 5px 10px rgba(255,255,255,0.45)", // soft top light
          `0 0 0 5px ${color}55`, // soft colored felt rim
        ].join(", "),
      }}
    >
      <span className={`${size.emoji}`} role="img">
        {icon}
      </span>
    </div>
  );
}
