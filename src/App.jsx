import { FamilyProvider, useFamily } from "./context/FamilyContext.jsx";
import { NavigationProvider, useNav } from "./context/NavigationContext.jsx";
import FamilySetup from "./pages/FamilySetup.jsx";
import HomeScreen from "./pages/HomeScreen.jsx";
import ChildOnboarding from "./pages/ChildOnboarding.jsx";
import ChildWorld from "./pages/ChildWorld.jsx";
import ParentGate from "./pages/ParentGate.jsx";
import ParentDashboard from "./pages/ParentDashboard.jsx";

/** Picks the screen for the current nav view (once the family is set up). */
function Router() {
  const { onboarded } = useFamily();
  const { view, params } = useNav();

  // Until a family + family pet exist, the only path is first-run onboarding.
  if (!onboarded) return <FamilySetup />;

  switch (view) {
    case "childOnboarding":
      return <ChildOnboarding />;
    case "childWorld":
      return <ChildWorld childId={params.childId} />;
    case "parentGate":
      return <ParentGate />;
    case "parentDashboard":
      return <ParentDashboard />;
    case "home":
    default:
      return <HomeScreen />;
  }
}

export default function App() {
  return (
    <FamilyProvider>
      <NavigationProvider>
        <div className="min-h-screen">
          <Router />
        </div>
      </NavigationProvider>
    </FamilyProvider>
  );
}
