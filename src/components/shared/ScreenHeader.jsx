/**
 * ScreenHeader — back button + title bar for sub-screens.
 */
import { useNav } from "../../context/NavigationContext.jsx";

export default function ScreenHeader({ title, subtitle, right = null, onBack }) {
  const { goBack } = useNav();
  const handleBack = onBack ?? goBack;

  return (
    <header className="flex items-center gap-3 px-5 py-4 sm:px-8">
      <button
        type="button"
        onClick={handleBack}
        aria-label="Go back"
        className="tap-target flex h-12 w-12 items-center justify-center rounded-full felt-surface text-2xl text-ink transition active:scale-90"
      >
        ←
      </button>
      <div className="min-w-0 flex-1">
        {title && (
          <h1 className="truncate font-display text-2xl font-extrabold text-ink sm:text-3xl">
            {title}
          </h1>
        )}
        {subtitle && <p className="truncate text-sm text-ink/60">{subtitle}</p>}
      </div>
      {right}
    </header>
  );
}
