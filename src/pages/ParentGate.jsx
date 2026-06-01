/**
 * ParentGate — PIN wall in front of the parent dashboard.
 */
import { useState } from "react";
import { useFamily } from "../context/FamilyContext.jsx";
import { useNav } from "../context/NavigationContext.jsx";
import WorldScene from "../components/shared/WorldScene.jsx";
import ScreenHeader from "../components/shared/ScreenHeader.jsx";
import PinPad from "../components/shared/PinPad.jsx";

export default function ParentGate() {
  const { verifyParentPin } = useFamily();
  const { navigate, goBack } = useNav();
  const [error, setError] = useState("");

  function submit(pin) {
    if (verifyParentPin(pin)) {
      navigate("parentDashboard");
      return true;
    }
    setError("That PIN didn't match.");
    return false;
  }

  return (
    <WorldScene tone="dusk" className="min-h-screen">
      <ScreenHeader title="Grown-ups only" onBack={goBack} />
      <div className="mx-auto flex max-w-md flex-col items-center px-5 pt-6">
        <div className="w-full rounded-5xl bg-white/70 p-6 shadow-soft backdrop-blur">
          <PinPad
            title="Enter Parent PIN"
            subtitle="The dashboard is just for grown-ups."
            error={error}
            onSubmit={submit}
            accent="#A78BFA"
          />
        </div>
      </div>
    </WorldScene>
  );
}
