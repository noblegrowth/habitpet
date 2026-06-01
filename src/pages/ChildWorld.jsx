/**
 * ChildWorld — a kid's personal space: their pet + Today's Journey.
 * Tasks grouped by check-in window, tap to complete (XP + streaks), a day
 * progress bar, and kid-initiated goal intake. Grace-first: nothing is locked.
 */
import { useState } from "react";
import { useFamily } from "../context/FamilyContext.jsx";
import { useNav } from "../context/NavigationContext.jsx";
import { getPersonalPet, MOOD_FACES } from "../data/pets.js";
import { levelProgress, moodForCompletion } from "../utils/xp.js";
import { buildToday, streakForTask } from "../utils/tasks.js";
import { todayKey, dayName } from "../utils/date.js";
import WorldScene from "../components/shared/WorldScene.jsx";
import ScreenHeader from "../components/shared/ScreenHeader.jsx";
import PetAvatar from "../components/pet/PetAvatar.jsx";
import XPBar from "../components/shared/XPBar.jsx";
import Button from "../components/shared/Button.jsx";
import CheckInWindow from "../components/tasks/CheckInWindow.jsx";
import TaskItem from "../components/tasks/TaskItem.jsx";
import KidGoalModal from "../components/tasks/KidGoalModal.jsx";

export default function ChildWorld({ childId }) {
  const { children, completeTask, undoTask, addKidGoal } = useFamily();
  const { reset } = useNav();
  const child = children.find((c) => c.id === childId);

  const [goalOpen, setGoalOpen] = useState(false);
  const [celebrate, setCelebrate] = useState(null);

  if (!child) {
    return (
      <WorldScene tone="day" className="min-h-screen">
        <ScreenHeader title="Hmm…" onBack={() => reset("home")} />
        <p className="px-8 text-ink/70">We couldn't find that world. Tap back to the home screen.</p>
      </WorldScene>
    );
  }

  const dateKey = todayKey();
  const day = buildToday(childId, dateKey);
  const def = getPersonalPet(child.pet?.petType);
  const accent = child.avatarColor || "#C27457";

  // Mood is reflective of today's effort (plan §5) — derived, not punitive.
  const moodKey = day.stats.totalCore > 0 ? moodForCompletion(day.stats.pct) : "happy";
  const mood = MOOD_FACES[moodKey] ?? MOOD_FACES.happy;
  const { level } = levelProgress(child.pet?.xp ?? 0);

  function handleToggle(task, done) {
    if (done) {
      undoTask({ childId, taskId: task.id, dateKey });
      return;
    }
    const res = completeTask({ childId, taskId: task.id, dateKey, window: day.currentWindow });
    if (res) {
      setCelebrate({ xp: res.xpAwarded, leveledUp: res.leveledUp, level: res.level });
      setTimeout(() => setCelebrate(null), 1900);
    }
  }

  function handleCreateGoal({ title, frequency }) {
    addKidGoal(childId, { title, frequency, ageBracket: child.ageBracket });
    setGoalOpen(false);
  }

  return (
    <WorldScene tone="meadow" className="min-h-screen">
      <ScreenHeader title={`${child.name}'s World`} subtitle={dayName(dateKey)} onBack={() => reset("home")} />

      <div className="mx-auto max-w-2xl px-5 pb-20">
        {/* pet + day progress */}
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <PetAvatar
              petId={child.pet?.petType}
              icon={def?.icon ?? "🐾"}
              color={accent}
              size="lg"
              pose="active"
              animate="idle"
            />
            <div className="absolute -right-1 top-0 rounded-full felt-surface px-2 py-1 text-2xl">
              {mood.face}
            </div>
          </div>
          <h2 className="mt-2 font-display text-2xl font-extrabold text-ink">
            {child.pet?.petName ?? "Your pet"}
          </h2>

          <div className="mt-3 w-full max-w-sm rounded-4xl felt-surface p-4">
            <XPBar xp={child.pet?.xp ?? 0} color={accent} label={`Level ${level}`} />
            <div className="mt-2 flex justify-between text-xs font-bold text-ink/60">
              <span>
                {day.stats.completedCore}/{day.stats.totalCore} done today
              </span>
              <span>+{day.stats.xpToday} XP today</span>
            </div>
          </div>
        </div>

        {/* today's journey */}
        <div className="mt-6 flex items-center justify-between">
          <h3 className="font-display text-xl font-extrabold text-ink">Today's Journey</h3>
          <Button size="md" variant="soft" onClick={() => setGoalOpen(true)}>
            🚀 New Goal
          </Button>
        </div>

        <div className="mt-3 space-y-4">
          {day.windows.map((w) => (
            <CheckInWindow
              key={w.id}
              window={w}
              accent={accent}
              streakFor={(taskId) => streakForTask(childId, taskId, dateKey).current}
              onToggle={handleToggle}
            />
          ))}

          {day.extras.length > 0 && (
            <section
              className="rounded-4xl p-4"
              style={{ backgroundColor: "rgba(255,255,255,0.35)" }}
            >
              <header className="mb-2 flex items-center gap-2 px-1">
                <span className="text-2xl" aria-hidden>🌈</span>
                <h3 className="font-display text-lg font-extrabold text-ink/80">Anytime &amp; Extras</h3>
              </header>
              <div className="space-y-2">
                {day.extras.map((item) => (
                  <TaskItem
                    key={item.task.id}
                    item={item}
                    accent={accent}
                    streak={streakForTask(childId, item.task.id, dateKey).current}
                    onToggle={handleToggle}
                  />
                ))}
              </div>
            </section>
          )}

          {day.windows.length === 0 && day.extras.length === 0 && (
            <div className="rounded-4xl felt-surface p-6 text-center text-ink/60">
              No tasks yet — tap “🚀 New Goal” to add one!
            </div>
          )}
        </div>
      </div>

      {celebrate && (
        <div className="pointer-events-none fixed inset-x-0 top-24 z-50 flex justify-center">
          <div className="animate-pop-in rounded-4xl bg-grass-deep px-6 py-3 text-center font-display text-xl font-extrabold text-white shadow-soft">
            {celebrate.leveledUp ? `🎉 Level ${celebrate.level}!` : `+${celebrate.xp} XP! 🌟`}
          </div>
        </div>
      )}

      {goalOpen && (
        <KidGoalModal
          onCreate={handleCreateGoal}
          onCancel={() => setGoalOpen(false)}
        />
      )}
    </WorldScene>
  );
}
