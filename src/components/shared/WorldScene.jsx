/**
 * WorldScene — the felted-diorama backdrop (see docs/DESIGN_SYSTEM.md).
 * A clean, slightly textured off-white seamless-paper sweep with soft studio
 * key light and a gentle cloth seam at the floor. Keeps the subject the focus.
 */
const TONES = {
  day: "#F7F1E6",
  dusk: "#F1E5DA",
  meadow: "#F4EEDF",
};

// Subtle paper grain (fractal noise) so the backdrop reads as cloth, not flat CSS.
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export default function WorldScene({ tone = "day", children, className = "" }) {
  const bg = TONES[tone] ?? TONES.day;

  return (
    <div
      className={`relative min-h-full w-full overflow-hidden ${className}`}
      style={{ backgroundColor: bg }}
    >
      {/* soft studio key light, upper-left */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 85% at 22% -5%, rgba(255,255,255,0.7), transparent 60%)",
        }}
      />
      {/* paper / cloth grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-multiply"
        style={{ backgroundImage: GRAIN, backgroundSize: "140px 140px" }}
      />
      {/* gentle floor seam + vignette for depth */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5"
        style={{
          background: "linear-gradient(to top, rgba(74,64,54,0.08), transparent)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          boxShadow: "inset 0 0 120px rgba(74,64,54,0.10)",
        }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
}
