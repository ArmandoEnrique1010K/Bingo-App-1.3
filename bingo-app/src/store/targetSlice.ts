import { StateCreator } from "zustand";
import { DEFAULT_TARGETS, MAX_TURNS, STAR_NUMBER, TARGET_GENERATION_DELAY } from "../constants/defaultConfigs";
import { BotSliceType } from "./botSlice";
import { AudioSliceType } from "./audioSlice";
import { ROLL_SOUND } from "../constants/audioSettings";
import { ExtraTargetsSliceType } from "./powerups/extraTargetsSlice";
import { generateTargets } from "../utils/generateTargets";
import { StatusSliceType } from "./statusSlice";
import { ForceNumberObjectiveCrossSliceType } from "./powerups/forceNumberObjetiveCrossSlice";
import { RandomNumberObjectiveSliceType } from "./powerups/randomNumberObjetiveSlice";
import { AutomaticMarkBoardSliceType } from "./powerups/automaticMarkBoardSlice";
import { ViewAllBotBoardsSliceType } from "./powerups/viewAllBotBoardsSlice";
import { SlowBotsSliceType } from "./powerups/slowBotsSlice";


export type TargetSliceType = {
    currentRound: number,
    currentTargets: number[],
    excludedTargets: number[],
    generateNewTargets: () => void;

}

export const targetSlice: StateCreator<TargetSliceType & BotSliceType & AudioSliceType
    & ExtraTargetsSliceType & StatusSliceType & ForceNumberObjectiveCrossSliceType
    & RandomNumberObjectiveSliceType & AutomaticMarkBoardSliceType & ViewAllBotBoardsSliceType
    & SlowBotsSliceType, [], [], TargetSliceType> = (set, get) => ({
        currentRound: 0,
        currentTargets: [],
        excludedTargets: [],
        generateNewTargets: () => {
            get().resetBotTimeouts()
            if (get().currentRound === MAX_TURNS) {
                set({ currentTargets: [], winner: "end" });
                get().noMoreRoundModal()
            } else {
                set({ currentRound: get().currentRound + 1, currentTargets: [] });
                get().playSound(ROLL_SOUND)
                setTimeout(() => {

                    let newTargets: number[] = [];
                    const forced = get().selectedForcedNumberObjective;
                    const extra = get().extraTargets.active;
                    const baseCount = DEFAULT_TARGETS;
                    const excluded = get().excludedTargets;


                    // AÑADIR LA LOGICA PARA EL POWERUP DE NUMERO ALEATORIO OBJETIVO
                    // FORZAR GENERAR EL NUMERO 'STAR_NUMBER'


                    // ERROR ENCONTRADO: Si ambos powerups estan activos, genera 4 numeros objetivos, deberia generar 3
                    // SOLUCION: 
                    // 

                    // TODO: AQUI DEBE ESTAR EL POWERUP DEL PATRON DE CRUZ
                    // Si hay un número forzado, genera 1 menos
                    // Si hay un numero aleatorio objetivo, genera 1 menos
                    // Si ambos, genera 2 menos
                    let count = forced !== 0 || get().randomNumberObjective.active
                        ? (extra ? baseCount + 1 : baseCount - 1)
                        : (extra ? baseCount + 2 : baseCount);

                    // ERROR ENCONTRADO: Si ambos powerups estan activos, genera 4 numeros objetivos, deberia generar 3
                    // SOLUCION: 
                    // 
                    if (forced !== 0 && get().randomNumberObjective.active) {
                        count -= 1;
                    }

                    // Si el numero forzado es diferente de 0 (significa que se activo el powerup del patron de cruz y hay un numero forzado)
                    // if (get().selectedForcedNumberObjective !== 0) {
                    //   const newTargets = generateTargets(
                    //     (get().extraTargets.active ? DEFAULT_TARGETS - 1 : 
                    //     DEFAULT_TARGETS), 
                    //     get().excludedTargets)
                    // }

                    // Generar objetivos (ya excluyendo el forzado si fuera necesario)
                    newTargets = generateTargets(count, excluded);

                    // const newTargets = generateTargets(
                    //   // TODO: EL POWERUP DE AÑADIR 2 OBJETIVOS EXTRA
                    //   get().extraTargets.active ?
                    //     DEFAULT_TARGETS + 2 :
                    //     DEFAULT_TARGETS

                    //   , get().excludedTargets);


                    // // TODO: AQUI DEBE ESTAR EL POWERUP DEL PATRON DE CRUZ
                    // Añadir el número forzado si aplica
                    if (forced !== 0) {
                        newTargets.push(forced);
                    }

                    if (get().randomNumberObjective.active) {
                        newTargets.push(STAR_NUMBER);
                    }
                    // set({
                    //   currentTargets: newTargets,
                    //   excludedTargets: [...get().excludedTargets, ...newTargets]
                    // });

                    // Actualizar estado
                    set({
                        currentTargets: newTargets,
                        excludedTargets: [...get().excludedTargets, ...newTargets],
                        // Debe ser reiniciado el numero forzado
                        selectedForcedNumberObjective: 0,
                    })

                    // TODO: ZONA DEL POWERUP DE MARCADO AUTOMATICO
                    if (get().automaticMarkBoard.active) {
                        get().findAllNumbersObjectiveInBoard(get().selectedBoardIdAutomaticMark);
                    }
                }, TARGET_GENERATION_DELAY);
            }

            // TODO: ZONA DE POWERUPS
            if (get().extraTargets.active) {
                get().decrementExtraTargetsTurnsRemaining();
            }

            if (get().slowBots.active) {
                get().decrementSlowBotsTurnsRemaining();
            }

            if (get().viewAllBotBoards.active) {
                get().decrementViewAllBotBoardsTurnsRemaining();
            }

            if (get().automaticMarkBoard.active) {
                get().decrementAutomaticMarkBoardTurnsRemaining();
            }

            if (get().randomNumberObjective.active) {
                get().decrementRandomNumberObjectiveTurnsRemaining();
            }
        },
    })