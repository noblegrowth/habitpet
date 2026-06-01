/**
 * Button — the one big, friendly, tappable button.
 * Touch-first: always clears the 44×44px minimum and has a satisfying press.
 */
const VARIANTS = {
  primary: "bg-sky-deep text-white shadow-soft hover:brightness-105",
  grass: "bg-grass-deep text-white shadow-soft hover:brightness-105",
  golden: "bg-golden-deep text-ink shadow-soft hover:brightness-105",
  coral: "bg-coral-deep text-white shadow-soft hover:brightness-105",
  soft: "bg-white text-ink shadow-soft hover:bg-sky-soft/40",
  ghost: "bg-transparent text-ink/70 hover:bg-ink/5",
};

const SIZES = {
  md: "px-6 py-3 text-lg",
  lg: "px-8 py-4 text-xl",
  xl: "px-10 py-5 text-2xl",
};

export default function Button({
  children,
  variant = "primary",
  size = "lg",
  full = false,
  className = "",
  disabled = false,
  ...props
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={[
        "tap-target inline-flex items-center justify-center gap-2 rounded-4xl font-display font-bold",
        "transition active:scale-95 disabled:opacity-40 disabled:active:scale-100",
        VARIANTS[variant] ?? VARIANTS.primary,
        SIZES[size] ?? SIZES.lg,
        full ? "w-full" : "",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
