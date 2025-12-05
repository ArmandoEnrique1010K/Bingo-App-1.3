import { StateCreator } from "zustand";
import { Level } from "../types";
import { AudioSliceType } from "./audioSlice";
import { SOMEDAY, } from "../constants/audioSettings";
import { NONE_MODAL, START_LEVEL_MODAL } from "../constants/statusModalsText";
import { MAX_POWERUPS } from "../constants/defaultConfigs";
import { PowerUpSliceType } from "./powerUpSlice";
import { BotSliceType } from "./botSlice";
import { generateBoard } from "../utils/Board/generateBoard";
import { createIdBoard } from "../utils/Bot/createIdBoard";
import { PlayerSliceType } from "./playerSlice";
import { levels } from "../data/levels";
import { StatusSliceType } from "./statusSlice";
import { SlowBotsSliceType } from "./powerups/slowBotsSlice";
import { RandomNumberObjectiveSliceType } from "./powerups/randomNumberObjetiveSlice";
import { ExtraTargetsSliceType } from "./powerups/extraTargetsSlice";
import { ForceNumberObjectiveCrossSliceType } from "./powerups/forceNumberObjetiveCrossSlice";
import { AutomaticMarkBoardSliceType } from "./powerups/automaticMarkBoardSlice";
import { ViewAllBotBoardsSliceType } from "./powerups/viewAllBotBoardsSlice";
import { TargetSliceType } from "./targetSlice";

export type LevelSliceType = {
  levelData: Level,
  unlockedLevelsList: number[];
  unlockLevel: (level: number) => void;
  getUnlockedLevelsFromStorage: () => void;
  getLevelNumberFromUrl: (pathname: string) => void
  getColorLevel: (level: number) => string;
  defaultLevelState: () => void;
  resetLevelState: () => void;
};

export const initialLevelData = {
  level: 0,
  color: 'blue',
  music: SOMEDAY,
  boards: 0,
  targetText: "",
  patterns: [],
  bots: [],
  tip: "",
}


export const levelSlice: StateCreator<LevelSliceType & AudioSliceType &
  PowerUpSliceType & ExtraTargetsSliceType & ForceNumberObjectiveCrossSliceType
  & BotSliceType & RandomNumberObjectiveSliceType & PlayerSliceType
  & StatusSliceType & SlowBotsSliceType & AutomaticMarkBoardSliceType & ViewAllBotBoardsSliceType & TargetSliceType, [], [], LevelSliceType> = (set, get) => ({
    levelData: initialLevelData,
    unlockedLevelsList: [],
    unlockLevel: (level: number) => {
      set((state) => {
        if (!state.unlockedLevelsList.includes(level)) {
          const updatedLevels = [...state.unlockedLevelsList, level];
          localStorage.setItem("unlockedLevels", JSON.stringify(updatedLevels));

          return { unlockedLevelsList: updatedLevels };
        }
        return state;

      },

      )
    },
    getUnlockedLevelsFromStorage: () => {
      const storedLevels = localStorage.getItem('unlockedLevels');

      if (!storedLevels) {
        localStorage.setItem('unlockedLevels', JSON.stringify([1]));
        set({ unlockedLevelsList: [1] });
        return;
      }

      set({ unlockedLevelsList: JSON.parse(storedLevels) });
    },


    getLevelNumberFromUrl: (pathname) => {
      const match = pathname.match(/\/level_(\d+)/);
      const level = match ? parseInt(match[1], 10) : 0;
      const numberLevel = levels.find(l => l.level === level) || initialLevelData;

      set({
        levelData: numberLevel,
      })
    },

    getColorLevel: (level) => {
      return levels.find(l => l.level === level)?.color ?? 'blue'
    },

    defaultLevelState: () => {
      set({
        playerBoards: [],
        botBoards: [],
        currentTargets: [],
        currentRound: 0,
        winner: '',
        excludedTargets: [],
        markedCells: [],
        isStatusModalOpen: false,
        modal: NONE_MODAL,
        currentBoard: { id: 0, cells: [] },
        confirmedWinners: {},
        gameEnded: true,
        listOfBotsWinners: [],
        foundCells: [],
        botMarkedCells: [],
        selectedPowerUpsIds: [],
      })
      get().resetDefaultPowerups()
      get().resetBotTimeouts()
    },

    resetLevelState: () => {
      const levelData = get().levelData;
      const { boards, bots, music } = levelData

      const createPlayerBoards = Array.from({ length: boards }).map((_, index) => ({
        id: index + 1,
        cells: generateBoard(),
      }));

      const createBotBoards = bots.map((bot, botIndex) => ({
        name: bot.name,
        boards: Array.from({ length: bot.boards }).map((_, boardIndex) => ({
          id: createIdBoard(botIndex, boardIndex),
          cells: generateBoard(),
        })),
      }));

      const initialSelectedNumbersAndPositions = Array.from({ length: boards }).map((_, index) => (
        {
          id: index + 1,
          cells: [
            {
              position: 13,
              number: 0
            }
          ]
        }
      ))

      set({
        botBoards: createBotBoards,
        playerBoards: createPlayerBoards,
      })

      const botInitialSelectedNumbersAndPositions = get().botBoards.map((bot) => ({
        name: bot.name,
        boards: bot.boards.map((board) => ({
          id: board.id,
          cells: [
            {
              position: 13,
              number: 0
            }
          ]
        }))
      }));

      set({
        botMarkedCells: botInitialSelectedNumbersAndPositions,
        currentTargets: [],
        currentRound: 0,
        winner: 'none',
        excludedTargets: [],
        isStatusModalOpen: true,
        modal: START_LEVEL_MODAL,
        confirmedWinners: {},
        listOfBotsWinners: [],
        // Al resetear el nivel, se debe establecer en false el estado de fin del juego
        gameEnded: false,
        foundCells: [],
        markedCells: initialSelectedNumbersAndPositions,
        currentBoard: get().playerBoards?.find(b => b.id === 1) || { id: 0, cells: [] },
        selectedPowerUpsIds: get().unlockedPowerUpsIds.length <= MAX_POWERUPS ? get().unlockedPowerUpsIds : [],
      })
      get().resetDefaultPowerups()
      get().resetBotTimeouts()
      get().changeMusic(music)
    },
  });