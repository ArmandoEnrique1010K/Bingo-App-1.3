import { StateCreator } from "zustand";
import { Boards, DetailsPowerUp, SwapNumberSelected } from "../../types";
import { POWERUP_SOUND } from "../../constants/audioSettings";
import { AudioSliceType } from "../audioSlice";
import { PlayerSliceType } from "../playerSlice";

export type SwapNumbersBoardSliceType = {
    swapNumbersBoard: DetailsPowerUp;
    // Intercambiar posiciones de 2 números de un tablero
    swapNumbersSelected: { firstNumber: SwapNumberSelected | null, secondNumber: SwapNumberSelected | null };
    activateSwapNumbersBoard: () => void;
    selectNumbersFromSwapNumbersBoard: (firstNumberClicked: SwapNumberSelected, secondNumberClicked: SwapNumberSelected) => void;
}

// Slice para el powerup de intercambiar 2 números de un tablero
export const swapNumbersBoardSlice: StateCreator<SwapNumbersBoardSliceType & AudioSliceType & PlayerSliceType, [], [], SwapNumbersBoardSliceType> = (set, get) => ({
    swapNumbersBoard: {
        type: 'oneTime',
        hasActivated: false,
        active: false,
        turnsRemaining: 0,
    },
    swapNumbersSelected: { firstNumber: null, secondNumber: null },

    activateSwapNumbersBoard: () => {
        set((state) => ({
            swapNumbersBoard: {
                ...state.swapNumbersBoard,
                // hasActivated: true,
                active: true,
                turnsRemaining: 1,
            },
        }));
    },


    selectNumbersFromSwapNumbersBoard: (firstNumberClicked: SwapNumberSelected, secondNumberClicked: SwapNumberSelected) => {
        // Debe llamar 2 veces a la funcion swapNumberBoardOnNumbersClicks para asignar los numeros
        // console.log('Seleccionando numeros para intercambiar ' + number)
        // swapNumberBoardOnNumbersClicks(boardId, number, position);

        // Si no se ha seleccionado ningun numero
        if (!get().swapNumbersSelected.firstNumber) {
            get().playSound(POWERUP_SOUND)
            set({
                swapNumbersSelected: {
                    firstNumber: {
                        id: firstNumberClicked!.id,
                        number: firstNumberClicked!.number,
                        position: firstNumberClicked!.position
                    },
                    secondNumber: null,
                },
            })
            // console.log(`Seleccionando primer numero ${firstNumberClicked?.id} ${firstNumberClicked?.position} ${firstNumberClicked?.number}`)

        } else if (!get().swapNumbersSelected.secondNumber) {
            const updatedState = {
                firstNumber: get().swapNumbersSelected.firstNumber,
                secondNumber: {
                    id: secondNumberClicked!.id,
                    number: secondNumberClicked!.number,
                    position: secondNumberClicked!.position
                },
            };

            get().playSound(POWERUP_SOUND)

            // console.log(`Seleccionando segundo numero ${secondNumberClicked!.id} ${secondNumberClicked!.position} ${secondNumberClicked!.number}`)

            // Si ha seleccionado el primer numero y luego vuelve hacer clic en el mismo numero, se debe deseleccionar
            if (get().swapNumbersSelected.firstNumber?.id === secondNumberClicked?.id &&
                get().swapNumbersSelected.firstNumber?.number === secondNumberClicked?.number &&
                get().swapNumbersSelected.firstNumber?.position === secondNumberClicked?.position) {
                set({
                    swapNumbersSelected: {
                        firstNumber: null,
                        secondNumber: null,
                    },
                });

                // Desactivar powerup
                set({
                    swapNumbersBoard: {
                        ...get().swapNumbersBoard,
                        active: false,
                        hasActivated: false,
                        turnsRemaining: 0,
                    },
                })

                // console.log(`Deseleccionando primer numero ${secondNumberClicked?.id} ${secondNumberClicked?.position} ${secondNumberClicked?.number}`)
                return;
            }


            if (updatedState.firstNumber?.id !== updatedState.secondNumber?.id) {
                // console.log(updatedState.firstNumber?.id)
                // console.log(updatedState.secondNumber?.id)
                // console.log(`Error, el id de ambos tableros debe ser el mismo, de lo contrario no se puede intercambiar`)

                // Limpiar el primer numero seleccionado
                set({
                    swapNumbersSelected: {
                        firstNumber: null,
                        secondNumber: null,
                    },
                })

                // Desactivar powerup
                set({
                    swapNumbersBoard: {
                        ...get().swapNumbersBoard,
                        active: false,
                        hasActivated: false,
                        turnsRemaining: 0,
                    },
                })
                return;
            }

            // console.log(updatedState.firstNumber?.id)
            // console.log(updatedState.secondNumber?.id)

            // console.log(`Intercambiando numeros ${updatedState.firstNumber?.number} y ${updatedState.secondNumber?.number}`)

            // Actualizar el tablero del jugador
            const updatedBoards: Boards = get().playerBoards.map((board) =>
                board.id === updatedState.firstNumber?.id
                    ? {
                        ...board,
                        // Intercambia el primer numero
                        cells: board.cells.map((cell) => {
                            if (cell.number === updatedState.firstNumber?.number && updatedState.secondNumber?.number !== undefined) {
                                return { ...cell, number: updatedState.secondNumber.number };
                            }

                            // Intercambia el segundo numero
                            if (cell.number === updatedState.secondNumber?.number && updatedState.firstNumber?.number !== undefined) {
                                return { ...cell, number: updatedState.firstNumber.number };
                            }
                            return cell;
                        })
                    }
                    : board
            );

            // console.log(updatedBoards)

            // Actualizar el tablero del jugador, sin agregar otros nuevos tableros
            set({
                playerBoards:
                    // ...get().playerBoards,
                    updatedBoards
            });




            // Actualizar las posiciones de los numeros seleccionados en el tablero
            const updateMarkedCells = get().markedCells.map((board) =>
                board.id === updatedState.firstNumber?.id
                    ? {
                        ...board,
                        cells: board.cells.map((cell) => {
                            if (cell.position === updatedState.firstNumber?.position &&
                                cell.number === updatedState.firstNumber?.number &&
                                updatedState.secondNumber?.position !== undefined) {
                                return { ...cell, number: updatedState.firstNumber.number, position: updatedState.secondNumber.position };
                            }

                            // Intercambia el segundo numero
                            if (cell.position === updatedState.secondNumber?.position &&
                                cell.number === updatedState.secondNumber?.number &&
                                updatedState.firstNumber?.position !== undefined) {
                                return { ...cell, number: updatedState.secondNumber.number, position: updatedState.firstNumber.position };
                            }
                            return cell;
                        })
                    }
                    : board
            );

            // console.log(updateMarkedCells)

            set({
                markedCells: updateMarkedCells
            })

            // Opcional: reiniciar selección
            set({
                // Bloquear el powerup
                swapNumbersBoard: {
                    ...get().swapNumbersBoard,
                    active: false,
                    hasActivated: true,
                    turnsRemaining: 0,
                },

                // Reiniciar seleccion
                swapNumbersSelected: {
                    firstNumber: null,
                    secondNumber: null,
                },
            });
        }

        return; // Para evitar que se mezclen con otras lógicas de click

    },
});