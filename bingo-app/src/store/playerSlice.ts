import { StateCreator } from "zustand";
import { LevelSliceType } from "./levelSlice";
import { Board, Boards, MarkedCells } from "../types";
import { AudioSliceType } from "./audioSlice";
import { FINAL_LEVEL_VICTORY_MODAL, ILEGAL_MODAL, VICTORY_MODAL } from "../constants/statusModalsText";
import { FINAL_LEVEL, STAR_NUMBER } from "../constants/defaultConfigs";
import { CORRECT_SOUND, VICTORY_SOUND, DARKNESS_SOLO, WRONG_SOUND, DEFEAT_SOUND, ANYMORE_ENDING, POWERUP_SOUND } from "../constants/audioSettings";
import { BotSliceType } from "./botSlice";
import { PowerUpSliceType } from "./powerUpSlice";
import { SwapNumbersBoardSliceType } from "./powerups/swapNumbersBoardSlice";
import { RandomNumberObjectiveSliceType } from "./powerups/randomNumberObjetiveSlice";
import { StatusSliceType } from "./statusSlice";
import { ForceNumberObjectiveCrossSliceType } from "./powerups/forceNumberObjetiveCrossSlice";
import { TargetSliceType } from "./targetSlice";

export type PlayerSliceType = {
  playerBoards: Boards,
  markedCells: MarkedCells,
  currentBoard: Board,
  setCurrentBoard: (id: number) => void,
  hasWinnerPattern: () => boolean,
  isCellMarked: (idBoard: number, position: number) => boolean,
  selectCell: (idBoard: number, number: number, position: number) => void
  hasKillAllBot: () => void,
}

export const playerSlice: StateCreator<PlayerSliceType & SwapNumbersBoardSliceType & StatusSliceType & TargetSliceType & ForceNumberObjectiveCrossSliceType & RandomNumberObjectiveSliceType & LevelSliceType & AudioSliceType & BotSliceType & PowerUpSliceType, [], [], PlayerSliceType> = (set, get) => ({
  playerBoards: [],
  markedCells: [],
  currentBoard: { id: 0, cells: [] },

  setCurrentBoard: (id: number) => {
    set({
      currentBoard: get().playerBoards.find(b => b.id === id)
    })
  },

  hasWinnerPattern: () => {
    for (const b of get().markedCells) {
      if (get().levelData.patterns.some((p: number[]) => p.every(n => b.cells.some(e => e.position === n)))) {
        set({
          currentTargets: [],
          winner: 'player',
          gameEnded: true,
          modal: get().levelData.level !== FINAL_LEVEL ? VICTORY_MODAL : FINAL_LEVEL_VICTORY_MODAL,
          isStatusModalOpen: true,
        })

        if (get().levelData.level !== FINAL_LEVEL) {
          get().unlockLevel(get().levelData.level + 1)
        }

        // DESBLOQUEAR UN POWERUP
        // Completa el nivel 2 para desbloquear el powerup del id 1
        // Completa el nivel 5 para desbloquear el powerup del id 2
        // Completa el nivel 8 para desbloquear el powerup del id 3
        // Completa el nivel 11 para desbloquear el powerup del id 4
        // Completa el nivel 14 para desbloquear el powerup del id 5

        // Si el nivel completado es multiplo de 3 menos 1, desbloquea el powerup
        const completedLevel = get().levelData.level;
        const powerUpId = Math.floor(completedLevel / 3) + 1;

        if (completedLevel % 3 === 2) {
          get().unlockPowerUp(powerUpId)
          // console.log("Se ha desbloqueado el powerup con el id: ", powerUpId)
        }

        get().resetBotTimeouts()

        get().playSound(VICTORY_SOUND)
        get().changeMusic(DARKNESS_SOLO)

        return true
      } else {
        get().playSound(WRONG_SOUND)

      }
    }

    return false;
  },

  isCellMarked: (idBoard: number, position: number) => {
    return get().markedCells.some(
      (b) => b.id === idBoard && b.cells.some((e) => e.position === position)
    );
  },

  selectCell: (idBoard, number, position) => {
    const {
      currentTargets,
      isCellMarked,
      markedCells,
      playSound,
      swapNumbersBoard,
      randomNumberObjective,
      selectRandomNumberObjectiveOnBoard
    } = get();

    const isTargetNumber = currentTargets.includes(number);
    const alreadyMarked = isCellMarked(idBoard, position);

    /** ✅ Caso 1: Selección válida de un número objetivo */
    if (isTargetNumber && !alreadyMarked) {
      set({
        markedCells: markedCells.map(b =>
          b.id === idBoard
            ? { ...b, cells: [...b.cells, { position, number }] }
            : b
        )
      });

      playSound(CORRECT_SOUND);

      // TODO: Aquí se manejaría la lógica del powerup "número aleatorio"
      return;
    }

    /** ⚡ Caso 2: Powerups especiales */

    // 🔹 Número forzado (pero desactivado) → reproducir sonido de powerup

    // TODO: CORREGIR ESTA PARTE, UNA VEZ QUE HA SIDO MARCADO NO DEBE REPRODUCIR EL SONIDO
    if (get().forceNumberObjectiveCross.active) {
      return;
    }

    // 🔹 Intercambiar números activo → cancelar acción
    if (swapNumbersBoard.active) {
      return;
    }

    // 🔹 Número aleatorio (icono estrella = STAR_NUMBER)
    const isRandomObjectiveActive =
      currentTargets.includes(STAR_NUMBER) &&
      randomNumberObjective.active &&
      randomNumberObjective.turnsRemaining === 0 &&
      !alreadyMarked;

    if (isRandomObjectiveActive) {
      selectRandomNumberObjectiveOnBoard(idBoard, number, position);
      playSound(POWERUP_SOUND);
      // console.log("Ha seleccionado el numero aleatorio");
      return;
    }

    /** ❌ Caso 3: Ninguna condición cumplida → sonido de error */
    playSound(WRONG_SOUND);
  },
  // Si el jugador ha hecho trampa eliminando a todos los bots con el powerup con id 10 (remove bot)
  hasKillAllBot: () => {
    set({
      currentTargets: [],
      winner: 'end',
      gameEnded: true,
      modal: ILEGAL_MODAL,
      isStatusModalOpen: true,
    })

    get().playSound(DEFEAT_SOUND)
    get().changeMusic(ANYMORE_ENDING)
  }
});