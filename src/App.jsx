import { useEffect, useState } from "react";
import { Taskbar, Desktop } from "./components/Desktop";
import { Startup } from "./components/UI";

function App() {
  const [hasLaunched, setHasLaunched] = useState(false);

  useEffect(() => {
    if (hasLaunched) {
      const audio = new Audio("assets/audio/intro.mp3");
      audio.play().catch((error) => console.log("Audio playback failed:", error));
    }
  }, [hasLaunched])
  
  /**
   * Main application layout. If the startup sequence has completed,
   * it loads the desktop environment. Otherwise, it starts the boot process.
   */
  return (
    <div className="flex flex-col w-screen h-screen font-msserif">
      {hasLaunched ? (
        <>
          <Desktop />
          <Taskbar />
        </>
      ) : (
        <Startup setHasLaunched={setHasLaunched} />
      )}
    </div>
  );
}

export default App;