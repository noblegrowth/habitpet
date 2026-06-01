/**
 * WorldScene — the animated living-world backdrop.
 * Layered sky gradient, sun, drifting clouds, and rolling hills. Children
 * render on top. `tone` shifts the palette so each space feels distinct.
 */
const TONES = {
  day: "from-sky-soft via-sky-soft/60 to-grass-soft",
  dusk: "from-grape-soft via-coral-soft/50 to-golden-soft",
  meadow: "from-sky-soft via-white to-grass-soft",
};

export default function WorldScene({ tone = "day", children, className = "" }) {
  return (
    <div
      className={`relative min-h-full w-full overflow-hidden bg-gradient-to-b ${
        TONES[tone] ?? TONES.day
      } ${className}`}
    >
      {/* sun */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-golden/80 blur-[2px] sm:h-56 sm:w-56" />
      <div className="pointer-events-none absolute right-6 top-6 h-28 w-28 rounded-full bg-golden-deep/70 sm:h-36 sm:w-36" />

      {/* drifting clouds */}
      <Cloud className="top-16 animate-drift-slow text-white/90" />
      <Cloud className="top-40 animate-drift-slower text-white/70" big />

      {/* rolling hills */}
      <svg
        className="pointer-events-none absolute bottom-0 left-0 w-full"
        viewBox="0 0 1440 220"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          fill="#86EFAC"
          fillOpacity="0.7"
          d="M0,160 C240,90 480,90 720,140 C960,190 1200,150 1440,110 L1440,220 L0,220 Z"
        />
        <path
          fill="#4ADE80"
          fillOpacity="0.8"
          d="M0,190 C300,140 600,200 900,180 C1140,165 1320,200 1440,180 L1440,220 L0,220 Z"
        />
      </svg>

      <div className="relative z-10">{children}</div>
    </div>
  );
}

function Cloud({ className = "", big = false }) {
  return (
    <div className={`pointer-events-none absolute left-0 ${className}`} aria-hidden>
      <span className={big ? "text-7xl" : "text-5xl"}>☁️</span>
    </div>
  );
}
