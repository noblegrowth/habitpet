/**
 * HomeScreen — the family's living world.
 * Family Pet + shared XP at center, child profile tiles below, parent lock
 * in the corner. Tapping a child enters their world (PIN-gated if they set one).
 */
import { useState } from "react";
import { useFamily } from "../context/FamilyContext.jsx";
import { useNav } from "../context/NavigationContext.jsx";
import { getPersonalPet } from "../data/pets.js";
import { levelForXp } from "../utils/xp.js";
import WorldScene from "../components/shared/WorldScene.jsx";
import FamilyPet from "../components/pet/FamilyPet.jsx";
import PetAvatar from "../components/pet/PetAvatar.jsx";
import PinPad from "../components/shared/PinPad.jsx";
import Button from "../components/shared/Button.jsx";

export default function HomeScreen() {
  const { family, familyPet, children, verifyChildPin } = useFamily();
  const { navigate } = useNav();
  const [gateChild, setGateChild] = useState(null);
  const [pinError, setPinError] = useState("");

  function enterChild(child) {
    if (child.pin) {
      setPinError("");
      setGateChild(child);
    } else {
      navigate("childWorld", { childId: child.id });
    }
  }

  function submitPin(pin) {
    if (verifyChildPin(gateChild.id, pin)) {
      const id = gateChild.id;
      setGateChild(null);
      navigate("childWorld", { childId: id });
      return true;
    }
    setPinError("Oops — try again!");
    return false;
  }

  return (
    <WorldScene tone="day" className="min-h-screen">
      {/* top bar */}
      <div className="flex items-start justify-between px-5 pt-5 sm:px-8">
        <div className="rounded-full felt-surface px-4 py-2 font-display font-extrabold text-ink">
          {family?.name ?? "Our Family"}
        </div>
        <button
          type="button"
          onClick={() => navigate("parentGate")}
          aria-label="Parent dashboard"
          className="tap-target flex h-12 w-12 items-center justify-center rounded-full felt-surface text-2xl transition active:scale-90"
        >
          🔒
        </button>
      </div>

      {/* family pet */}
      <section className="mt-2 flex flex-col items-center px-5">
        <FamilyPet pet={familyPet} />
      </section>

      {/* children */}
      <section className="mx-auto mt-8 w-full max-w-4xl px-5 pb-12">
        <h3 className="mb-3 text-center font-display text-lg font-extrabold text-ink/70">
          Tap your pet to enter your world
        </h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {children.map((child) => (
            <ChildTile key={child.id} child={child} onEnter={enterChild} />
          ))}
          <AddChildTile onClick={() => navigate("childOnboarding")} />
        </div>
      </section>

      {gateChild && (
        <PinGate
          child={gateChild}
          error={pinError}
          onSubmit={submitPin}
          onCancel={() => setGateChild(null)}
        />
      )}
    </WorldScene>
  );
}

function ChildTile({ child, onEnter }) {
  const def = getPersonalPet(child.pet?.petType);
  const level = levelForXp(child.pet?.xp ?? 0);

  return (
    <button
      type="button"
      onClick={() => onEnter(child)}
      className="tap-target group flex flex-col items-center gap-2 rounded-4xl border-4 border-transparent felt-surface p-4 transition active:scale-95 hover:border-coral-soft"
    >
      <div className="relative">
        <PetAvatar
          petId={child.pet?.petType}
          icon={def?.icon ?? "🐾"}
          color={child.avatarColor}
          size="md"
          pose="face"
          animate="idle"
        />
        {child.pin && (
          <span className="absolute -right-1 -top-1 rounded-full felt-surface px-1.5 text-sm" aria-label="Locked">
            🔒
          </span>
        )}
      </div>
      <div className="text-center">
        <div className="font-display text-xl font-extrabold leading-tight text-ink">
          {child.name}
        </div>
        <div className="text-xs font-bold text-ink/50">
          {child.pet?.petName ?? "New pet"} · Lvl {level}
        </div>
      </div>
    </button>
  );
}

function AddChildTile({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="tap-target flex min-h-[140px] flex-col items-center justify-center gap-2 rounded-4xl border-4 border-dashed border-ink/20 bg-white/40 p-4 text-ink/50 transition active:scale-95 hover:border-sky-deep hover:text-sky-deep"
    >
      <span className="text-5xl">＋</span>
      <span className="font-display font-extrabold">Add a Kid</span>
    </button>
  );
}

function PinGate({ child, error, onSubmit, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-5 backdrop-blur-sm">
      <div className="w-full max-w-sm animate-pop-in rounded-5xl bg-cream p-6 shadow-soft">
        <PinPad
          title={`Hi ${child.name}!`}
          subtitle="Enter your secret PIN"
          accent={child.avatarColor}
          error={error}
          onSubmit={onSubmit}
        />
        <div className="mt-6 text-center">
          <Button variant="ghost" size="md" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
