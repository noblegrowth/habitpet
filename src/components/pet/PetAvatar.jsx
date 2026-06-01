/**
 * PetAvatar — an animated emoji pet inside a soft glowing bubble.
 * The CSS/emoji placeholder we'll swap for Lottie in Phase 4.
 */
const SIZES = {
  sm: { box: "h-14 w-14", emoji: "text-3xl" },
  md: { box: "h-24 w-24", emoji: "text-5xl" },
  lg: { box: "h-36 w-36", emoji: "text-7xl" },
  xl: { box: "h-52 w-52 sm:h-64 sm:w-64", emoji: "text-8xl sm:text-9xl" },
};

export default function PetAvatar({
  icon = "🐾",
  color = "#7DD3FC",
  size = "md",
  animate = "float",
  ring = false,
  className = "",
}) {
  const s = SIZES[size] ?? SIZES.md;
  const anim = animate === "none" ? "" : `animate-${animate}`;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {ring && (
        <span
          className="absolute inset-0 animate-pulse-ring rounded-full"
          style={{ boxShadow: `0 0 0 6px ${color}55` }}
        />
      )}
      <div
        className={`flex items-center justify-center rounded-full ${s.box}`}
        style={{
          background: `radial-gradient(circle at 35% 30%, #ffffff, ${color}55 70%, ${color}88)`,
          boxShadow: `0 12px 30px -8px ${color}aa`,
        }}
      >
        <span className={`${s.emoji} ${anim} drop-shadow-sm`} role="img">
          {icon}
        </span>
      </div>
    </div>
  );
}
