/**
 * PinPad — big touch-friendly numeric keypad for entering / setting a PIN.
 *
 * Fires onSubmit(pin) once `length` digits are entered. If onSubmit returns
 * `false` (a wrong PIN), the pad clears and shakes; the parent supplies the
 * `error` text to show. Returning anything else is treated as success.
 */
import { useState } from "react";

export default function PinPad({
  length = 4,
  title = "Enter PIN",
  subtitle,
  onSubmit,
  error,
  accent = "#7DD3FC",
}) {
  const [pin, setPin] = useState("");
  const [attempt, setAttempt] = useState(0); // bump → replays the shake animation

  function complete(fullPin) {
    const result = onSubmit?.(fullPin);
    if (result === false) {
      setPin("");
      setAttempt((a) => a + 1);
    }
  }

  function press(digit) {
    setPin((p) => {
      if (p.length >= length) return p;
      const next = p + digit;
      // Defer so the final dot paints before the parent reacts.
      if (next.length === length) setTimeout(() => complete(next), 120);
      return next;
    });
  }

  function backspace() {
    setPin((p) => p.slice(0, -1));
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <h2 className="font-display text-2xl font-extrabold text-ink">{title}</h2>
        {subtitle && <p className="mt-1 text-ink/60">{subtitle}</p>}
      </div>

      {/* dots — key={attempt} remounts the row so the shake animation replays */}
      <div key={attempt} className={`flex gap-4 ${attempt > 0 ? "animate-wiggle" : ""}`}>
        {Array.from({ length }).map((_, i) => (
          <span
            key={i}
            className="h-5 w-5 rounded-full border-2 transition"
            style={{
              borderColor: accent,
              backgroundColor: i < pin.length ? accent : "transparent",
            }}
          />
        ))}
      </div>

      {error && <p className="font-display text-sm font-bold text-coral-deep">{error}</p>}

      {/* keypad */}
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <KeypadButton key={n} onClick={() => press(String(n))}>
            {n}
          </KeypadButton>
        ))}
        <span /> {/* spacer */}
        <KeypadButton onClick={() => press("0")}>0</KeypadButton>
        <KeypadButton onClick={backspace} aria-label="Delete">
          ⌫
        </KeypadButton>
      </div>
    </div>
  );
}

function KeypadButton({ children, ...props }) {
  return (
    <button
      type="button"
      className="tap-target flex h-16 w-16 items-center justify-center rounded-3xl felt-surface font-display text-2xl font-bold text-ink transition active:scale-90 active:bg-coral-soft/50 sm:h-20 sm:w-20"
      {...props}
    >
      {children}
    </button>
  );
}
