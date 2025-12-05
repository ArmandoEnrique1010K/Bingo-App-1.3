import { StateCreator } from "zustand";
import { DetailsPowerUp } from "../../types";
import { LevelSliceType } from "../levelSlice";
import { PlayerSliceType } from "../playerSlice";
import { TargetSliceType } from "../targetSlice";

export type MarkNeighborgNumbersSliceType = {
    // Marcar numeros vecinos (los numeros de la forma: X - 2, X - 1, X, X + 1 y X + 2). X es un numero en el tablero
    markNeighborgNumbers: DetailsPowerUp;
    //   // Marcar numeros vecinos (los numeros de la forma: X - 2, X - 1, X, X + 1 y X + 2). X es un numero en el tablero
    activateMarkNeighborgNumbers: () => void;
    markNeighborgNumbersOnNumberClick: (
        boardId: number,
        numberClicked: number
    ) => void;

}

// Slice para el powerup de incrementar 2 números objetivos extra
export const markNeighborgNumbersSlice: StateCreator<MarkNeighborgNumbersSliceType & LevelSliceType & PlayerSliceType & TargetSliceType, [], [], MarkNeighborgNumbersSliceType> = (set, get) => ({
    markNeighborgNumbers: {
        type: 'oneTime',
        hasActivated: false,
        active: false,
        turnsRemaining: 0,
    },


    activateMarkNeighborgNumbers: () => {
        set((state) => ({
            markNeighborgNumbers: {
                ...state.markNeighborgNumbers,
                // Esta propiedad indica que el powerup ya ha sido activado, por lo que ya no se podra volver a activar
                // hasActivated: true,
                active: true,
                turnsRemaining: 1,
            },
        }));
    },

    markNeighborgNumbersOnNumberClick: (
        boardId: number,
        numberClicked: number
    ) => {
        const { playerBoards, currentTargets, markedCells, markNeighborgNumbers } = get();

        // Verificación de power-up y objetivo
        if (
            !markNeighborgNumbers.active ||
            !currentTargets.includes(numberClicked)
        )
            return;

        // Encontrar el board correspondiente
        const boardObj = playerBoards.find((b) => b.id === boardId);
        if (!boardObj) return;

        // Buscar los números vecinos en el tablero del jugador
        const neighbors = [
            numberClicked - 2,
            numberClicked - 1,
            numberClicked,
            numberClicked + 1,
            numberClicked + 2,
        ];

        // Buscar posiciones de estos números dentro del tablero del jugador
        // Buscar números vecinos
        const matched = boardObj.cells.filter((cell) =>
            neighbors.includes(cell.number)
        );
        if (matched.length === 0) return;

        const existingBoard =
            markedCells.find((sel) => sel.id === boardId)?.cells ?? [];
        // Verificar si alguno de los vecinos ya ha sido marcado
        // const hasAlreadyMarked = matched.some(matchedCell =>
        //   existingBoard.some(existing => existing.position === matchedCell.position)
        // );
        // if (hasAlreadyMarked) return;

        // Reemplazar si ya existía el boardId en markedCells
        // const updatedSelected = [...markedCells.filter(sel => sel.id !== boardId), {
        //   id: boardId,
        //   board: [
        //     ...(markedCells.find(sel => sel.id === boardId)?.board ?? []),
        //     ...matched.filter(
        //       (newItem) =>
        //         !markedCells
        //           .find(sel => sel.id === boardId)?.board
        //           ?.some(existing => existing.position === newItem.position)
        //     )
        //   ]
        // }];

        const updatedSelected = [
            ...markedCells.filter((sel) => sel.id !== boardId),
            {
                id: boardId,
                cells: [...existingBoard, ...matched],
            },
        ];

        // Agregar al estado de seleccionados
        set(() => ({
            markedCells: updatedSelected,
            markNeighborgNumbers: {
                ...markNeighborgNumbers,
                active: false,
                hasActivated: true,
                turnsRemaining: 0,
            },
        }));
    },
});