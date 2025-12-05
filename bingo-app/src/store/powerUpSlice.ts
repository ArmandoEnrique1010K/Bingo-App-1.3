import { StateCreator } from "zustand";
import { LevelSliceType } from "./levelSlice";
import { PlayerSliceType } from "./playerSlice";
import { BotSliceType } from "./botSlice";
import { POWERUP_SOUND, WRONG_SOUND } from "../constants/audioSettings";
import { MAX_POWERUPS } from "../constants/defaultConfigs";
import { AudioSliceType } from "./audioSlice";
import { AUTO_MARK_BOARD, CROSS_PATTERN, MARK_NEIGHBORING_NUMBERS, REMOVE_BOT, SWAP_NUMBERS, UNMARK_NUMBER_BOT } from "../constants/powerupConstants";
import { SlowBotsSliceType } from "./powerups/slowBotsSlice";
import { ExtraTargetsSliceType } from "./powerups/extraTargetsSlice";
import { UnmarkNumberBotSliceType } from "./powerups/unmarkNumberBotSlice";
import { SwapNumbersBoardSliceType } from "./powerups/swapNumbersBoardSlice";
import { ForceNumberObjectiveCrossSliceType } from "./powerups/forceNumberObjetiveCrossSlice";
import { AutomaticMarkBoardSliceType } from "./powerups/automaticMarkBoardSlice";
import { MarkNeighborgNumbersSliceType } from "./powerups/markNeighborgNumbersSlice";
import { ViewAllBotBoardsSliceType } from "./powerups/viewAllBotBoardsSlice";
import { RandomNumberObjectiveSliceType } from "./powerups/randomNumberObjetiveSlice";
import { KillBotSliceType } from "./powerups/killBotSlice";

export type PowerUpSliceType = {
  unlockedPowerUpsIds: number[];
  unlockPowerUp: (id: number) => void;
  getUnlockedPowerUpsFromStorage: () => void;
  selectedPowerUpsIds: number[],
  selectPowerUp: (id: number) => void,
  unSelectPowerUp: (id: number) => void,



  // Reiniciar los valores predeterminados de los powerups
  currentSelectPowerUpName: string;
  currentSelectPowerUpDescription: string;
  changeCurrentSelectPowerUp: (name: string, description: string) => void;
  togglePowerUp: (id: number) => void;
  cancelPowerUp: (id: number) => void;
  resetDefaultPowerups: () => void;
};

export const powerUpSlice: StateCreator<
  PowerUpSliceType &
  LevelSliceType &
  PlayerSliceType &
  BotSliceType &
  AudioSliceType & SlowBotsSliceType & ExtraTargetsSliceType & UnmarkNumberBotSliceType
  & SwapNumbersBoardSliceType & ForceNumberObjectiveCrossSliceType & AutomaticMarkBoardSliceType
  & MarkNeighborgNumbersSliceType & ViewAllBotBoardsSliceType & RandomNumberObjectiveSliceType
  & KillBotSliceType & KillBotSliceType,
  [],
  [],
  PowerUpSliceType
> = (set, get) => ({

  unlockedPowerUpsIds: [],
  // Si el numero de powerups desbloqueados es menor que 3, se seleccionan todos los powerups desbloqueados, de lo contrario no se seleccionan ninguno, el jugador debera seleccionar los powerups
  // selectedPowerUpsIds: get().unlockedPowerUpsIds.length > MAX_POWERUPS ? get().unlockedPowerUpsIds : [],
  selectedPowerUpsIds: [],
  selectPowerUp: (id: number) => {
    set({
      selectedPowerUpsIds: [...get().selectedPowerUpsIds, id]
    })
  },
  unSelectPowerUp: (id: number) => {
    set({
      selectedPowerUpsIds: get().selectedPowerUpsIds.filter((powerUpId) => powerUpId !== id)
    })
  },


  unlockPowerUp: (id: number) => {
    // Los powerups se desbloquean al completar un nivel 
    // Si el jugador ha completado el nivel 2, se desbloquea el powerup con el id 1
    // Si el jugador ha completado el nivel 5, se desbloquea el powerup con el id 2
    // Si el jugador ha completado el nivel 8, se desbloquea el powerup con el id 3
    // Si el jugador ha completado el nivel 11, se desbloquea el powerup con el id 4
    // Si el jugador ha completado el nivel 14, se desbloquea el powerup con el id 5
    // Etc...
    set((state) => {
      if (!state.unlockedPowerUpsIds.includes(id)) {
        const updatedPowerUps = [...state.unlockedPowerUpsIds, id];
        localStorage.setItem("unlockedPowerUpsIds", JSON.stringify(updatedPowerUps));

        return { unlockedPowerUpsIds: updatedPowerUps };
      }
      return state;
    })
  },

  getUnlockedPowerUpsFromStorage: () => {
    const storedPowerUps = localStorage.getItem('unlockedPowerUpsIds');

    if (!storedPowerUps) {
      localStorage.setItem('unlockedPowerUpsIds', JSON.stringify([]));
      set({ unlockedPowerUpsIds: [] });
      return;
    }

    set({ unlockedPowerUpsIds: JSON.parse(storedPowerUps) });
  },








  currentSelectPowerUpName: '',
  currentSelectPowerUpDescription: '',
  changeCurrentSelectPowerUp(name: string, description: string) {
    set({
      currentSelectPowerUpName: name,
      currentSelectPowerUpDescription: description,
    });
  },


  // FUNCIONES RELACIONADAS AL POWERUP #9: Numero aleatorio objetivo
  // Si el jugador ha pulsado ese botón, en el siguiente turno se generara el número objetivo 'STAR_NUMBER', el cual tiene la funcionalidad de ser forzado a salir en los numeros objetivos
  // Y si sale ese numero STAR_NUMBER, el jugador podra marcar un numero aleatorio de su tablero y contara como si estuviera marcado rompiendo las reglas
  // Por lo tanto, el jugador podra marcar un numero aleatorio de su tablero y contara como si estuviera marcado rompiendo las reglas




  // Función para agregar o quitar powerups
  togglePowerUp(id: number) {

    // Si el powerup ya esta seleccionado, se deselecciona, de lo contrario se selecciona
    if (get().selectedPowerUpsIds.includes(id)) {
      get().unSelectPowerUp(id)
      get().playSound(WRONG_SOUND)
    } else {
      // Si el numero de powerups seleccionados es mayor o igual al maximo, no se puede seleccionar otro
      if (get().selectedPowerUpsIds.length >= MAX_POWERUPS) {
        get().playSound(WRONG_SOUND)
        return;
      }
      get().selectPowerUp(id)
      get().playSound(POWERUP_SOUND)
    }
  },



  cancelPowerUp(id: number) {
    // set({

    // })
    // console.log('Se ha cancelado el powerup ' + id)

    // TODO: AÑADIR MÁS POWERUPS
    if (id === UNMARK_NUMBER_BOT) {
      set({
        unmarkNumberBot: {
          ...get().unmarkNumberBot,
          hasActivated: false,
          active: false,
        },
      })
    }


    if (id === SWAP_NUMBERS) {
      set({
        swapNumbersBoard: {
          ...get().swapNumbersBoard,
          hasActivated: false,
          active: false,
        },

        swapNumbersSelected: {
          firstNumber: null,
          secondNumber: null,
        },
      })
    }

    if (id === AUTO_MARK_BOARD) {
      set({
        automaticMarkBoard: {
          ...get().automaticMarkBoard,
          hasActivated: false,
          active: false,
        },
      })
    }

    if (id === CROSS_PATTERN) {
      set({
        forceNumberObjectiveCross: {
          ...get().forceNumberObjectiveCross,
          hasActivated: false,
          active: false,
        },
      })
    }


    if (id === MARK_NEIGHBORING_NUMBERS) {
      set({
        markNeighborgNumbers: {
          ...get().markNeighborgNumbers,
          hasActivated: false,
          active: false,
        },
      })
    }
    // if (id === RANDOM_TARGET) {
    //   set({
    //     randomNumberObjective: {
    //       ...get().randomNumberObjective,
    //       hasActivated: false,
    //       active: false,
    //     },
    //   })
    // }
    if (id === REMOVE_BOT) {
      set({
        killBot: {
          ...get().killBot,
          hasActivated: false,
          active: false,
        },
      })
    }
  },

  resetDefaultPowerups() {
    set({
      selectedForcedNumberObjective: 0,

      slowBots: {
        type: 'continuous',
        hasActivated: false,
        active: false,
        turnsRemaining: 5,
      },

      extraTargets: {
        type: 'continuous',
        hasActivated: false,
        active: false,
        turnsRemaining: 3,
      },

      unmarkNumberBot: {
        type: 'oneTime',
        hasActivated: false,
        active: false,
        turnsRemaining: 1,
      },

      swapNumbersBoard: {
        type: 'oneTime',
        hasActivated: false,
        active: false,
        turnsRemaining: 1,
      },

      swapNumbersSelected: {
        firstNumber: null,
        secondNumber: null,
      },

      forceNumberObjectiveCross: {
        type: 'oneTime',
        hasActivated: false,
        active: false,
        turnsRemaining: 1,
      },

      automaticMarkBoard: {
        type: 'continuous',
        hasActivated: false,
        active: false,
        turnsRemaining: 5,
      },
      selectedBoardIdAutomaticMark: 0,
      markNeighborgNumbers: {
        type: 'oneTime',
        hasActivated: false,
        active: false,
        turnsRemaining: 1,
      },

      viewAllBotBoards: {
        type: 'continuous',
        hasActivated: false,
        active: false,
        turnsRemaining: 5,
      },

      randomNumberObjective: {
        type: 'continuous',
        hasActivated: false,
        active: false,
        turnsRemaining: 1,
      },

      killBot: {
        type: 'oneTime',
        hasActivated: false,
        active: false,
        turnsRemaining: 1,
      },

      killedBotName: ' '
    })
  },

  // TODO: SE DEBE REINICIAR A LOS VALORES INICIALES DEL POWERUP CADA VEZ QUE CAMBIA DE NIVEL
});