/**
 * ParentDashboard — Phase 1 stub (PIN-gated).
 * Family overview: each child, their pet, level. Full dashboard = Phase 5.
 */
import { useFamily } from "../context/FamilyContext.jsx";
import { useNav } from "../context/NavigationContext.jsx";
import { getPersonalPet, getFamilyPet as lookupFamilyPet } from "../data/pets.js";
import { levelForXp } from "../utils/xp.js";
import ScreenHeader from "../components/shared/ScreenHeader.jsx";
import Button from "../components/shared/Button.jsx";

export default function ParentDashboard() {
  const { family, familyPet, children } = useFamily();
  const { goBack, navigate } = useNav();
  const familyDef = lookupFamilyPet(familyPet?.petType);

  return (
    <div className="min-h-screen bg-cream">
      <ScreenHeader
        title="Parent Dashboard"
        subtitle={family?.name}
        onBack={goBack}
        right={
          <Button size="md" variant="primary" onClick={() => navigate("childOnboarding")}>
            ＋ Add Kid
          </Button>
        }
      />

      <div className="mx-auto max-w-3xl space-y-6 px-5 pb-16">
        {/* family pet */}
        <section className="rounded-4xl bg-white p-5 shadow-soft">
          <h2 className="font-display text-lg font-extrabold text-ink/70">Family Pet</h2>
          <div className="mt-2 flex items-center gap-4">
            <span className="text-5xl">{familyDef?.icon ?? "🐾"}</span>
            <div>
              <div className="font-display text-xl font-extrabold text-ink">
                {familyPet?.petName}
              </div>
              <div className="text-sm text-ink/60">
                {familyDef?.name} · Level {levelForXp(familyPet?.xp ?? 0)} · {familyPet?.xp ?? 0} XP
              </div>
            </div>
          </div>
        </section>

        {/* kids */}
        <section className="rounded-4xl bg-white p-5 shadow-soft">
          <h2 className="font-display text-lg font-extrabold text-ink/70">
            Children ({children.length})
          </h2>
          <div className="mt-3 divide-y divide-ink/5">
            {children.length === 0 && (
              <p className="py-4 text-ink/50">No kids yet — tap “Add Kid” to start.</p>
            )}
            {children.map((child) => {
              const def = getPersonalPet(child.pet?.petType);
              return (
                <div key={child.id} className="flex items-center gap-4 py-3">
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-full text-2xl"
                    style={{ backgroundColor: `${child.avatarColor}55` }}
                  >
                    {def?.icon ?? "🐾"}
                  </span>
                  <div className="flex-1">
                    <div className="font-display font-extrabold text-ink">{child.name}</div>
                    <div className="text-sm text-ink/60">
                      Age {child.ageBracket} · {child.pet?.petName ?? "no pet"} · Lvl{" "}
                      {levelForXp(child.pet?.xp ?? 0)}
                      {child.pin ? " · 🔒 PIN set" : ""}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-4xl border-4 border-dashed border-ink/15 bg-white/50 p-6 text-center text-ink/50">
          <div className="text-4xl">🛠️</div>
          <p className="mt-2 font-display font-extrabold">More coming in Phase 5</p>
          <p className="text-sm">
            Approval queue, weekly AI reports, task config, and reward thresholds.
          </p>
        </section>
      </div>
    </div>
  );
}
