import { StateCreator } from "zustand";
import { DetailsPowerUp } from "../../types";

export type ViewAllBotBoardsSliceType = {
    // Ver todos los tableros de los bots por 5 turnos
    viewAllBotBoards: DetailsPowerUp;
    // // Ver todos los tableros de los bots por 5 turnos
    activateViewAllBotBoards: () => void;
    decrementViewAllBotBoardsTurnsRemaining: () => void;
}

// Slice para el powerup de incrementar 2 números objetivos extra
export const viewAllBotBoardsSlice: StateCreator<ViewAllBotBoardsSliceType, [], [], ViewAllBotBoardsSliceType> = (set, get) => ({
    viewAllBotBoards: {
        type: 'continuous',
        hasActivated: false,
        active: false,
        turnsRemaining: 0,
    },

    activateViewAllBotBoards: () => {
        set({
            viewAllBotBoards: {
                ...get().viewAllBotBoards,
                active: true,
                turnsRemaining: 5,
                hasActivated: true,
            },
        });
    },

    decrementViewAllBotBoardsTurnsRemaining: () => {
        const { viewAllBotBoards } = get();
        if (viewAllBotBoards.active && viewAllBotBoards.turnsRemaining > 0) {
            set({
                viewAllBotBoards: {
                    ...viewAllBotBoards,
                    turnsRemaining: viewAllBotBoards.turnsRemaining - 1,
                },
            });
        } else {
            // Desactivar power-up si se acaba
            set({
                viewAllBotBoards: {
                    ...viewAllBotBoards,
                    active: false,
                    turnsRemaining: 0,
                },
            });
        }
    },
});