import { useEffect, useRef, useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import {
  MAX_TURNS,
  STAR_NUMBER,
  UNLOCK_BUTTON_GENERATE_TARGETS_DELAY,
} from "../../constants/defaultConfigs";

export default function TargetNumbers() {
  const currentTargets = useAppStore((state) => state.currentTargets);
  const currentRound = useAppStore((state) => state.currentRound);
  const levelData = useAppStore((state) => state.levelData);
  const generateNewTargets = useAppStore((state) => state.generateNewTargets);

  const timeoutRef = useRef<number>(1);

  const randomNumberObjective = useAppStore((state) => state.randomNumberObjective)

  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    if (currentRound === 0) {
      setButtonDisabled(false);
      return;
    }

    if (currentTargets.length === 0) {
      setButtonDisabled(true);
      return;
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(
      () => setButtonDisabled(false),
      UNLOCK_BUTTON_GENERATE_TARGETS_DELAY
    );

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentTargets, currentRound]);

  const getActionText = () => {
    if (currentRound === 0) {
      return "Iniciar";
    }
    if (currentRound === MAX_TURNS) return "Rendirse";
    return "Siguiente";
  };

  const buttonClasses = `bg-${levelData.color
    }-500 text-white font-semibold 
    sm:px-6 px-4 sm:py-3 py-2 
    text-xs sm:text-sm md:text-base 
    cursor-pointer
     rounded-lg shadow-black shadow-md  ${buttonDisabled
      ? "bg-gray-300 opacity-50 cursor-not-allowed"
      : "hover:bg-gray-900"
    }`;
  // @min-[475px]:bg-yellow-200
  return (
    <div className="bg-gray-700 rounded-xl p-2 shadow-lg xsm:h-32 sm:h-40 md:h-44 h-40">
      <h2
        className={`text-base sm:text-lg md:text-xl font-semibold text-${levelData.color}-500`}
      >
        Objetivos
      </h2>

      {currentTargets.length > 0 && (
        <div className=" flex flex-wrap align-top  sm:gap-2 gap-1 md:py-3 sm:py-2 py-2  justify-center items-start
         
 ">
          {currentTargets.map((n, index) => (
            <div
              key={index}
              className=" sm:w-11 sm:h-11 w-7 h-7 flex items-center justify-center border-2 border-none bg-white text-black font-semibold rounded-full sm:text-lg text-sm shadow-md shadow-black"
            >
              {randomNumberObjective.hasActivated && n === STAR_NUMBER ? '⭐' : n}
            </div>
          ))}
        </div>
      )}

      <div className="text-center my-2">
        <button
          className={buttonClasses}
          onClick={generateNewTargets}
          disabled={buttonDisabled}
        >
          {getActionText()}
        </button>
      </div>
    </div>
  );
}
