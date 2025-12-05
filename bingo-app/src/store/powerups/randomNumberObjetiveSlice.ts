import { StateCreator } from "zustand";
import { DetailsPowerUp } from "../../types";
import { PlayerSliceType } from "../playerSlice";

export type RandomNumberObjectiveSliceType = {
    randomNumberObjective: DetailsPowerUp;
    activateRandomNumberObjetive: () => void;
    decrementRandomNumberObjectiveTurnsRemaining: () => void;
    selectRandomNumberObjectiveOnBoard: (idBoard: number, numberClicked: number, position: number) => void;
    playerHasMarkedRandomNumberObjective: boolean;
}

// Slice para el powerup de ralentizar bots
export const randomNumberObjectiveSlice: StateCreator<RandomNumberObjectiveSliceType & PlayerSliceType, [], [], RandomNumberObjectiveSliceType> = (set, get) => ({
    randomNumberObjective: {
        type: 'continuous',
        hasActivated: false,
        active: false,
        turnsRemaining: 0,
    },

    /// FUNCIONES RELACIONADAS AL POWERUP #9: Numero aleatorio objetivo
    activateRandomNumberObjetive: () => {
        set({
            randomNumberObjective: {
                ...get().randomNumberObjective,
                hasActivated: true,
                active: true,
                turnsRemaining: 1,
            },
        });
    },

    decrementRandomNumberObjectiveTurnsRemaining: () => {
        const { randomNumberObjective } = get();
        if (randomNumberObjective.active && randomNumberObjective.turnsRemaining > 0) {
            set({
                randomNumberObjective: {
                    ...randomNumberObjective,
                    turnsRemaining: randomNumberObjective.turnsRemaining - 1,
                },
            });
        } else {
            // Desactivar power-up si se acaba
            set({
                randomNumberObjective: {
                    ...randomNumberObjective,
                    active: false,
                    turnsRemaining: 0,
                },
            });
        }
    },

    playerHasMarkedRandomNumberObjective: false,

    // Función para marcar el numero aleatorio objetivo, el numero STAR_NUMBER equivale a cualquier numero
    selectRandomNumberObjectiveOnBoard: (idBoard: number, numberClicked: number, position: number) => {
        // console.log('Ha hecho clic en el numero ' + numberClicked + ' del tablero ' + idBoard + ' en la posicion ' + position)

        // AÑADIR ESE NUMERO EN LOS NUMEROS MARCADOS DEL JUGADOR
        set({
            markedCells: get().markedCells.map(b => {
                if (b.id === idBoard) {
                    return {
                        ...b,
                        cells: [
                            ...b.cells,
                            {
                                position: position,
                                number: numberClicked,
                            }
                        ]
                    }
                }
                return b
            }),

            // Podria ser una buena opción, eliminar el numero STAR_NUMBER de la lista de numeros objetivo
            playerHasMarkedRandomNumberObjective: true,
            // currentTargets: get().currentTargets.filter(t => t !== STAR_NUMBER),
        })

        // Nota: Solamente se puede marcar un numero aleatorio una sola vez en un tablero


        // Luego de haber hecho clic en cualquier numero

        // Al seleccionar un numero del tablero, que no sea el numero objetivo, se considera como el numero aletorio

        const { randomNumberObjective } = get();
        if (!randomNumberObjective.active) return;

        // Desactivar el powerup al final
        set({
            randomNumberObjective: {
                ...randomNumberObjective,
                active: false,
                hasActivated: true,
                turnsRemaining: 0,
            },
        });
    },

});