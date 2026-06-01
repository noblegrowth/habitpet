/**
 * CheckInWindow — a labelled section of the day (Wake Up, Bedtime, …) holding
 * its tasks. The window matching the current time of day is highlighted.
 */
import TaskItem from "./TaskItem.jsx";

export default function CheckInWindow({ window, accent, streakFor, onToggle }) {
  const allDone = window.tasks.length > 0 && window.tasks.every((t) => t.done);

  return (
    <section
      className={`rounded-4xl p-4 ${
        window.isCurrent ? "ring-4 ring-coral-soft" : ""
      }`}
      style={{ backgroundColor: "rgba(255,255,255,0.35)" }}
    >
      <header className="mb-2 flex items-center gap-2 px-1">
        <span className="text-2xl" aria-hidden>{window.icon}</span>
        <h3 className="font-display text-lg font-extrabold text-ink/80">{window.label}</h3>
        {window.isCurrent && (
          <span className="rounded-full bg-coral-deep px-2 py-0.5 text-[11px] font-bold text-white">
            now
          </span>
        )}
        {allDone && <span className="ml-auto text-xl" aria-label="all done">🎉</span>}
      </header>

      <div className="space-y-2">
        {window.tasks.map((item) => (
          <TaskItem
            key={item.task.id}
            item={item}
            accent={accent}
            streak={streakFor ? streakFor(item.task.id) : 0}
            onToggle={onToggle}
          />
        ))}
      </div>
    </section>
  );
}
