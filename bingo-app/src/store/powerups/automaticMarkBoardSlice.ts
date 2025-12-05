import { StateCreator } from "zustand";
import { DetailsPowerUp } from "../../types";
import { PlayerSliceType } from "../playerSlice";
import { LevelSliceType } from "../levelSlice";
import { TargetSliceType } from "../targetSlice";

export type AutomaticMarkBoardSliceType = {
    automaticMarkBoard: DetailsPowerUp;
    activateAutomaticMarkBoard: () => void;
    selectedBoardIdAutomaticMark: number;
    selectBoardIdAutomaticMark: (boardId: number) => void;
    findAllNumbersObjectiveInBoard: (boardId: number) => void;
    decrementAutomaticMarkBoardTurnsRemaining: () => void;
}

// Slice para el powerup de automarcar un tablero por 5 turnos
export const automaticMarkBoardSlice: StateCreator<AutomaticMarkBoardSliceType & PlayerSliceType & LevelSliceType & TargetSliceType, [], [], AutomaticMarkBoardSliceType> = (set, get) => ({
    automaticMarkBoard: {
        type: 'continuous',
        hasActivated: false,
        active: false,
        turnsRemaining: 0,
    },
    // PATRON DE CRUZ
    /****************** */
    activateAutomaticMarkBoard: () => {
        set((state) => ({
            automaticMarkBoard: {
                ...state.automaticMarkBoard,
                // Esta propiedad indica que el powerup ya ha sido activado, por lo que ya no se podra volver a activar
                type: 'oneTime',
                active: true,
                turnsRemaining: 1,
            },
        }));
    },
    selectedBoardIdAutomaticMark: 0,



    // Acción para encontrar todos los numeros objetivo en un tablero
    // Debe buscar los numeros objetivo en el tablero del jugador seleccionado, manteniendo los numeros marcados previamente en markedCells
    // Nota: esta acción sera llamada luego de que se generen los numeros objetivos
    findAllNumbersObjectiveInBoard: (boardId: number) => {
        const { playerBoards } = get();
        const board = playerBoards.find((board) => board.id === boardId);
        if (!board) {
            console.error('No board found with id:', boardId);
            return;
        }
        const currentTargets = get().currentTargets;
        const matched = board.cells.filter((cell) =>
            currentTargets.includes(cell.number)
        );
        // console.log(matched)

        // let updatedMarked: [] = [];

        // Obtener las celdas marcadas (markedCells), buscar el tablero por el id y solamente modificar ese tablero
        set({
            markedCells: get().markedCells.map((board) =>
                // Solamente debe añadir los numeros objetivos encontrados al tablero seleccionado
                board.id === boardId ? { ...board, cells: [...board.cells, ...matched] } : board
            ),
        })
        // const boardMarked = get().markedCells.find((board) => board.id === boardId)?.board

        // Guardar estado actualizado
        // set({ markedCells: updatedMarked });

    },
    selectBoardIdAutomaticMark: (boardId: number) => {
        // console.log('Selected board id: ' + boardId)
        set({
            selectedBoardIdAutomaticMark: boardId,
            automaticMarkBoard: {
                ...get().automaticMarkBoard,
                type: 'continuous',
                active: true,
                turnsRemaining: 5,
            },
        });
        // const previousMarked = get().markedCells;

        // // Buscar si ya existe una entrada con ese boardId
        // const alreadyMarkedIndex = previousMarked.findIndex((item) => item.id === boardId);
        const playerBoard = get().playerBoards.find((board) => board.id === boardId);
        if (!playerBoard) {
            // Handle the case where no board was found
            console.error('No board found with id:', boardId);
            return; // or handle this case appropriately
        }


        get().findAllNumbersObjectiveInBoard(boardId)
    },

    decrementAutomaticMarkBoardTurnsRemaining: () => {
        const { automaticMarkBoard } = get();
        if (automaticMarkBoard.active && automaticMarkBoard.turnsRemaining > 0) {
            set({
                automaticMarkBoard: {
                    ...automaticMarkBoard,
                    turnsRemaining: automaticMarkBoard.turnsRemaining - 1,
                },
            });
        } else {
            // Desactivar power-up si se acaba
            set({
                automaticMarkBoard: {
                    ...automaticMarkBoard,
                    active: false,
                    turnsRemaining: 0,
                    hasActivated: true,
                },
            });
        }
    },
});