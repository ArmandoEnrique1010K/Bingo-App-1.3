import { Outlet, useLocation } from "react-router";
import { useAppStore } from "../store/useAppStore";
import { useEffect } from "react";
import MusicButton from "../components/Menu/MusicButton";
import ExitButton from "../components/Menu/ExitButton";
import ResetButton from "../components/Menu/ResetButton";
import { preloadSoundFiles } from "../utils/Audio/preloadSoundFiles";
import { preloadMusicFiles } from "../utils/Audio/preloadMusicFiles";

import CreditsButton from "../components/Menu/CreditsButton";
import HelpButton from "../components/Menu/HelpButton";
import { LOADING_TIME } from "../constants/defaultConfigs";
import SoundButton from "../components/Menu/SoundButton";

export default function Layout() {
  const getUnlockedLevelsFromStorage = useAppStore(
    (state) => state.getUnlockedLevelsFromStorage
  );
  const loadedGame = useAppStore(
    (state) => state.loadedGame
  );
  const getLevelNumberFromUrl = useAppStore(
    (state) => state.getLevelNumberFromUrl
  );
  const isMenuLevelsVisible = useAppStore(
    (state) => state.isMenuLevelsVisible
  );
  const getUnlockedPowerUpsFromStorage = useAppStore(
    (state) => state.getUnlockedPowerUpsFromStorage
  );
  // const unlockLevel = useAppStore((state) => state.unlockLevel);

  const location = useLocation();

  useEffect(() => {
    getLevelNumberFromUrl(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    setTimeout(() => {
      loadedGame();
    }, LOADING_TIME);

    preloadMusicFiles();
    preloadSoundFiles();
    getUnlockedLevelsFromStorage();
    getUnlockedPowerUpsFromStorage();
    // unlockLevel(1);
  }, []);

  return (
    <div className="flex flex-col min-w-full h-screen">
      <div className="flex flex-row items-center justify-start sm:py-0 py-0 px-8  bg-gray-900 text-white shadow-lg">
        {!isMenuLevelsVisible || (
          <>
            <CreditsButton />
            <MusicButton />
            <SoundButton />
            <HelpButton />
          </>
        )}

        {location.pathname === "/" || (
          <>
            <ResetButton />
            <ExitButton />
          </>
        )}
      </div>

      <main className={`${location.pathname === "/" && isMenuLevelsVisible ? "bg-with-logo bg-gray-800" : "bg-gray-800"}  flex-grow`}>
        <Outlet />
      </main>
    </div>
  );
}
