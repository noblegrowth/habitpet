/**
 * ChildOnboarding — add a kid: name → age bracket → pet → name pet → optional PIN.
 */
import { useState } from "react";
import { PERSONAL_PET_OPTIONS, AGE_BRACKETS, AVATAR_COLORS } from "../data/pets.js";
import { useFamily } from "../context/FamilyContext.jsx";
import { useNav } from "../context/NavigationContext.jsx";
import WorldScene from "../components/shared/WorldScene.jsx";
import ScreenHeader from "../components/shared/ScreenHeader.jsx";
import PetOptionCard from "../components/pet/PetOptionCard.jsx";
import PinPad from "../components/shared/PinPad.jsx";
import Button from "../components/shared/Button.jsx";

const STEPS = ["name", "age", "pet", "petName", "pin"];

export default function ChildOnboarding() {
  const { addChild } = useFamily();
  const { reset } = useNav();

  const [stepIdx, setStepIdx] = useState(0);
  const [name, setName] = useState("");
  const [ageBracket, setAgeBracket] = useState(null);
  const [color, setColor] = useState(AVATAR_COLORS[0]);
  const [pet, setPet] = useState(null);
  const [petName, setPetName] = useState("");

  const step = STEPS[stepIdx];
  const next = () => setStepIdx((i) => Math.min(i + 1, STEPS.length - 1));
  const back = () => setStepIdx((i) => Math.max(i - 1, 0));

  function choosePet(p) {
    setPet(p);
    setPetName(p.defaultName ?? "");
  }

  function create(pin) {
    addChild(
      { name: name.trim(), ageBracket, pin: pin || null, avatarColor: color },
      { petType: pet.id, petName: petName.trim() || pet.defaultName },
    );
    reset("home");
  }

  return (
    <WorldScene tone="day" className="min-h-screen">
      <ScreenHeader
        title="Add a Kid"
        subtitle={`Step ${stepIdx + 1} of ${STEPS.length}`}
        onBack={stepIdx === 0 ? () => reset("home") : back}
      />
      <div className="mx-auto flex max-w-3xl flex-col items-center px-5 pb-12">
        {step === "name" && (
          <Card>
            <h2 className="font-display text-3xl font-extrabold text-ink">
              What's your name?
            </h2>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Type your name"
              maxLength={24}
              className="mt-6 w-full rounded-4xl border-4 border-white bg-cream px-6 py-4 text-center font-display text-2xl font-bold text-ink shadow-soft outline-none focus:border-sky-deep"
            />
            <p className="mt-6 font-display font-bold text-ink/60">Pick your color</p>
            <div className="mt-3 flex flex-wrap justify-center gap-3">
              {AVATAR_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-label={`Color ${c}`}
                  onClick={() => setColor(c)}
                  className={`tap-target h-12 w-12 rounded-full border-4 transition active:scale-90 ${
                    color === c ? "border-ink/50 scale-110" : "border-white"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <NavRow onNext={next} nextDisabled={!name.trim()} />
          </Card>
        )}

        {step === "age" && (
          <Card>
            <h2 className="font-display text-3xl font-extrabold text-ink">
              How old are you?
            </h2>
            <p className="mt-2 text-ink/60">This helps your pet talk just right.</p>
            <div className="mt-6 grid w-full gap-3">
              {AGE_BRACKETS.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setAgeBracket(a.id)}
                  aria-pressed={ageBracket === a.id}
                  className={`tap-target flex items-center gap-4 rounded-4xl border-4 bg-white p-4 text-left transition active:scale-95 ${
                    ageBracket === a.id ? "border-sky-deep shadow-glow" : "border-transparent shadow-soft"
                  }`}
                >
                  <span className="text-4xl">{a.emoji}</span>
                  <span>
                    <span className="block font-display text-2xl font-extrabold text-ink">
                      {a.label}
                    </span>
                    <span className="text-sm font-semibold text-ink/60">{a.blurb}</span>
                  </span>
                </button>
              ))}
            </div>
            <NavRow onBack={back} onNext={next} nextDisabled={!ageBracket} />
          </Card>
        )}

        {step === "pet" && (
          <div className="w-full animate-fade-up">
            <div className="text-center">
              <h2 className="font-display text-3xl font-extrabold text-ink">
                Choose your pet
              </h2>
              <p className="mt-2 text-ink/60">This little buddy grows with you.</p>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {PERSONAL_PET_OPTIONS.map((p) => (
                <PetOptionCard
                  key={p.id}
                  pet={p}
                  selected={pet?.id === p.id}
                  onSelect={choosePet}
                />
              ))}
            </div>
            <div className="mx-auto mt-8 max-w-md">
              <NavRow onBack={back} onNext={next} nextDisabled={!pet} />
            </div>
          </div>
        )}

        {step === "petName" && (
          <Card>
            <h2 className="font-display text-3xl font-extrabold text-ink">
              Name your {pet?.name}
            </h2>
            <div className="mt-4 text-7xl">{pet?.icon}</div>
            <input
              autoFocus
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              placeholder={pet?.defaultName}
              maxLength={20}
              className="mt-6 w-full rounded-4xl border-4 border-white bg-cream px-6 py-4 text-center font-display text-2xl font-bold text-ink shadow-soft outline-none focus:border-sky-deep"
            />
            <NavRow onBack={back} onNext={next} nextLabel="Almost done →" />
          </Card>
        )}

        {step === "pin" && (
          <Card>
            <PinPad
              title="Want a secret PIN?"
              subtitle="Optional — keeps your world just for you. Or skip it!"
              accent={color}
              onSubmit={create}
            />
            <div className="mt-6 flex justify-center gap-3">
              <Button variant="ghost" size="md" onClick={back}>
                Back
              </Button>
              <Button variant="grass" size="md" onClick={() => create(null)}>
                Skip — no PIN
              </Button>
            </div>
          </Card>
        )}
      </div>
    </WorldScene>
  );
}

function Card({ children }) {
  return (
    <div className="mt-4 flex w-full max-w-md animate-fade-up flex-col items-center rounded-5xl bg-white/70 p-6 text-center shadow-soft backdrop-blur">
      {children}
    </div>
  );
}

function NavRow({ onBack, onNext, nextDisabled = false, nextLabel = "Next →" }) {
  return (
    <div className="mt-8 flex justify-center gap-3">
      {onBack && (
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
      )}
      <Button variant="primary" disabled={nextDisabled} onClick={onNext}>
        {nextLabel}
      </Button>
    </div>
  );
}
