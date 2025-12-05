import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { levelSlice, LevelSliceType } from "./levelSlice";
import { playerSlice, PlayerSliceType } from "./playerSlice";
import { audioSlice, AudioSliceType } from "./audioSlice";
import { botSlice, BotSliceType } from "./botSlice";
import { powerUpSlice, PowerUpSliceType } from "./powerUpSlice";
import { menuSlice, MenuSliceType } from "./menuSlice";
import { statusSlice, StatusSliceType } from "./statusSlice";
import { slowBotsSlice, SlowBotsSliceType } from "./powerups/slowBotsSlice";
import { extraTargetsSlice, ExtraTargetsSliceType } from "./powerups/extraTargetsSlice";
import { unmarkNumberBotSlice, UnmarkNumberBotSliceType } from "./powerups/unmarkNumberBotSlice";
import { swapNumbersBoardSlice, SwapNumbersBoardSliceType } from "./powerups/swapNumbersBoardSlice";
import { forceNumberObjectiveCrossSlice, ForceNumberObjectiveCrossSliceType } from "./powerups/forceNumberObjetiveCrossSlice";
import { automaticMarkBoardSlice, AutomaticMarkBoardSliceType } from "./powerups/automaticMarkBoardSlice";
import { markNeighborgNumbersSlice, MarkNeighborgNumbersSliceType } from "./powerups/markNeighborgNumbersSlice";
import { viewAllBotBoardsSlice, ViewAllBotBoardsSliceType } from "./powerups/viewAllBotBoardsSlice";
import { randomNumberObjectiveSlice, RandomNumberObjectiveSliceType } from "./powerups/randomNumberObjetiveSlice";
import { killBotSlice, KillBotSliceType } from "./powerups/killBotSlice";
import { targetSlice, TargetSliceType } from "./targetSlice";

// Creación del store global de la aplicación, combina todos los slices definidos
export const useAppStore = create<LevelSliceType & PlayerSliceType & AudioSliceType
  & BotSliceType & PowerUpSliceType & MenuSliceType & StatusSliceType & TargetSliceType
  & SlowBotsSliceType & ExtraTargetsSliceType & UnmarkNumberBotSliceType & SwapNumbersBoardSliceType
  & ForceNumberObjectiveCrossSliceType & AutomaticMarkBoardSliceType & MarkNeighborgNumbersSliceType
  & ViewAllBotBoardsSliceType & RandomNumberObjectiveSliceType & KillBotSliceType>()(devtools((...a) => ({
    ...levelSlice(...a),
    ...playerSlice(...a),
    ...audioSlice(...a),
    ...botSlice(...a),
    ...powerUpSlice(...a),
    ...menuSlice(...a),
    ...statusSlice(...a),
    ...targetSlice(...a),

    // CADA POWERUP TIENE SU PROPIO SLICE
    ...slowBotsSlice(...a),
    ...extraTargetsSlice(...a),
    ...unmarkNumberBotSlice(...a),
    ...swapNumbersBoardSlice(...a),
    ...forceNumberObjectiveCrossSlice(...a),
    ...automaticMarkBoardSlice(...a),
    ...markNeighborgNumbersSlice(...a),
    ...viewAllBotBoardsSlice(...a),
    ...randomNumberObjectiveSlice(...a),
    ...killBotSlice(...a),
  })))