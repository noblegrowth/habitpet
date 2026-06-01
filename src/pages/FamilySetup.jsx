/**
 * FamilySetup — first-run onboarding (no family exists yet).
 * Steps: welcome → name family → choose + name the Family Pet → set parent PIN.
 */
import { useState } from "react";
import { FAMILY_PET_OPTIONS } from "../data/pets.js";
import { useFamily } from "../context/FamilyContext.jsx";
import WorldScene from "../components/shared/WorldScene.jsx";
import PetOptionCard from "../components/pet/PetOptionCard.jsx";
import PetAvatar from "../components/pet/PetAvatar.jsx";
import PinPad from "../components/shared/PinPad.jsx";
import Button from "../components/shared/Button.jsx";

export default function FamilySetup() {
  const { setupFamily } = useFamily();
  const [step, setStep] = useState(0);
  const [familyName, setFamilyName] = useState("");
  const [pet, setPet] = useState(null);
  const [petName, setPetName] = useState("");

  function choosePet(p) {
    setPet(p);
    setPetName(p.defaultName ?? "");
  }

  function finish(pin) {
    setupFamily({
      name: familyName.trim() || "Our Family",
      pin,
      petType: pet.id,
      petName: petName.trim() || pet.defaultName,
    });
    // FamilyProvider flips `onboarded` → App swaps to HomeScreen automatically.
  }

  return (
    <WorldScene tone="meadow" className="min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-5 py-10">
        {step === 0 && (
          <div className="animate-pop-in text-center">
            <PetAvatar icon="🦅" color="#FDE68A" size="xl" animate="float" />
            <h1 className="mt-6 font-display text-4xl font-extrabold text-ink sm:text-5xl">
              Welcome to HabitPet!
            </h1>
            <p className="mx-auto mt-3 max-w-md text-lg text-ink/70">
              Let's set up your family's world. Everyone grows together with a
              shared Family Pet — and each kid gets a pet of their own.
            </p>
            <Button className="mt-8" size="xl" variant="golden" onClick={() => setStep(1)}>
              Let's go! ✨
            </Button>
          </div>
        )}

        {step === 1 && (
          <div className="w-full max-w-md animate-fade-up text-center">
            <h1 className="font-display text-3xl font-extrabold text-ink">
              What's your family called?
            </h1>
            <p className="mt-2 text-ink/60">This shows up around your world.</p>
            <input
              autoFocus
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              placeholder="The Gallo Family"
              maxLength={40}
              className="mt-6 w-full rounded-4xl border-4 border-white bg-white/80 px-6 py-4 text-center font-display text-2xl font-bold text-ink shadow-soft outline-none focus:border-sky-deep"
            />
            <div className="mt-8 flex justify-center gap-3">
              <Button variant="ghost" onClick={() => setStep(0)}>
                Back
              </Button>
              <Button variant="primary" onClick={() => setStep(2)}>
                Next →
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="w-full animate-fade-up">
            <div className="text-center">
              <h1 className="font-display text-3xl font-extrabold text-ink">
                Choose your Family Pet
              </h1>
              <p className="mt-2 text-ink/60">
                The whole family helps this one grow. Pick together!
              </p>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {FAMILY_PET_OPTIONS.map((p) => (
                <PetOptionCard
                  key={p.id}
                  pet={p}
                  selected={pet?.id === p.id}
                  onSelect={choosePet}
                />
              ))}
            </div>

            {pet && (
              <div className="mt-6 rounded-4xl bg-white/80 p-5 text-center shadow-soft backdrop-blur">
                <p className="font-display font-bold text-ink/70">
                  Name your {pet.name}
                </p>
                <input
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  placeholder={pet.defaultName}
                  maxLength={20}
                  className="mt-2 w-full max-w-xs rounded-3xl border-4 border-white bg-cream px-5 py-3 text-center font-display text-xl font-bold text-ink shadow-soft outline-none focus:border-sky-deep"
                />
              </div>
            )}

            <div className="mt-8 flex justify-center gap-3">
              <Button variant="ghost" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button variant="primary" disabled={!pet} onClick={() => setStep(3)}>
                Next →
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="w-full max-w-md animate-fade-up rounded-5xl bg-white/70 p-6 shadow-soft backdrop-blur">
            <PinPad
              title="Set a Parent PIN"
              subtitle="Grown-ups use this to reach the parent dashboard."
              onSubmit={finish}
              accent="#7DD3FC"
            />
            <div className="mt-6 text-center">
              <Button variant="ghost" size="md" onClick={() => setStep(2)}>
                Back
              </Button>
            </div>
          </div>
        )}
      </div>
    </WorldScene>
  );
}
