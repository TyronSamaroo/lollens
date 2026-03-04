import { useGameEvents } from "@/hooks/useGameEvents";
import { OverlayShell } from "@/components/overlay/OverlayShell";

function App() {
  useGameEvents();

  return <OverlayShell />;
}

export default App;
