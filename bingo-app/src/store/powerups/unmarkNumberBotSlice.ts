import { StateCreator } from "zustand";
import { DetailsPowerUp } from "../../types";
import { BotSliceType } from "../botSlice";
import { AudioSliceType } from "../audioSlice";
import { POWERUP_SOUND } from "../../constants/audioSettings";

export type UnmarkNumberBotSliceType = {
    unmarkNumberBot: DetailsPowerUp;
    // Desmarcar un numero de un bot
    activateUnmarkNumberBot: () => void;
    unmarkNumberBotOnNumberClick: (
        botName: string,
        idBoard: string,
        numberClicked: number
    ) => void;
}

// Slice para el powerup de incrementar 2 números objetivos extra
export const unmarkNumberBotSlice: StateCreator<UnmarkNumberBotSliceType & BotSliceType & AudioSliceType, [], [], UnmarkNumberBotSliceType> = (set, get) => ({
    unmarkNumberBot: {
        type: 'oneTime',
        hasActivated: false,
        active: false,
        turnsRemaining: 0,
    },
    // Desmarcar un numero del tablero del bot
    activateUnmarkNumberBot: () => {
        set((state) => ({
            unmarkNumberBot: {
                ...state.unmarkNumberBot,
                active: true,
                turnsRemaining: 1,
            },
        }));
    },

    // Este powerup solamente tiene un solo uso
    unmarkNumberBotOnNumberClick: (
        botName: string,
        idBoard: string,
        numberClicked: number
    ) => {
        const { botBoards, botMarkedCells, unmarkNumberBot } = get();

        // Verificación de power-up y objetivo
        if (!unmarkNumberBot.active) return;

        // TODO: CORREGIR AQUI
        // Encontrar el board correspondiente y buscar el numero objetivo en el tablero del bot
        const boardObj = botBoards.find((b) =>
            b.boards.find(
                (board) =>
                    board.id === idBoard &&
                    board.cells.find((cell) => cell.number === numberClicked)
            )
        );
        if (!boardObj) return;

        const findedNumber = boardObj.boards
            .find((board) => board.id === idBoard)
            ?.cells.find((cell) => cell.number === numberClicked);
        if (!findedNumber) return;
        // console.log(findedNumber);


        // Imprimir los numeros marcados del tablero del bot seleccionado
        const markedNumbers = botMarkedCells
            .find((bot) => bot.name === botName)
            ?.boards.find((board) => board.id === idBoard)?.cells;
        // console.log(markedNumbers);

        // Verificar si el numero seleccionado no ha sido marcado
        const hasAlreadyMarked = markedNumbers?.some(
            (cell) => cell.number === numberClicked
        );
        if (!hasAlreadyMarked) return;

        // Eliminar del tablero del bot el numero marcado
        // const updatedMarkedNumbers = markedNumbers?.filter(
        //   (cell) => cell.number !== numberClicked
        // );
        // console.log(updatedMarkedNumbers);

        // Actualizar el tablero del bot
        const updatedBotMarkedCells = botMarkedCells.map((bot) =>
            bot.name === botName
                ? {
                    ...bot,
                    boards: bot.boards.map((board) =>
                        board.id === idBoard
                            ? {
                                ...board,
                                cells: board.cells.filter(
                                    (cell) => cell.number !== numberClicked
                                ),
                            }
                            : board
                    ),
                }
                : bot
        );
        // console.log(updatedBotMarkedCells);

        set(() => ({
            botMarkedCells: updatedBotMarkedCells,
            unmarkNumberBot: {
                ...unmarkNumberBot,
                active: false,
                hasActivated: true,
                turnsRemaining: 0,
            },
        }));

        get().playSound(POWERUP_SOUND)
    },
});