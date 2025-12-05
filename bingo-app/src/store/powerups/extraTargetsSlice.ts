import { StateCreator } from "zustand";
import { DetailsPowerUp } from "../../types";

export type ExtraTargetsSliceType = {
    extraTargets: DetailsPowerUp;
    activateExtraTargets: () => void;
    decrementExtraTargetsTurnsRemaining: () => void;
}

// Slice para el powerup de incrementar 2 números objetivos extra
export const extraTargetsSlice: StateCreator<ExtraTargetsSliceType, [], [], ExtraTargetsSliceType> = (set, get) => ({
    extraTargets: {
        type: 'continuous',
        hasActivated: false,
        active: false,
        turnsRemaining: 0,
    },

    // Incrementar 2 números objetivos extra
    activateExtraTargets: () => {
        set({
            extraTargets: {
                ...get().extraTargets,
                hasActivated: true,
                active: true,
                turnsRemaining: 3,
            },
        });
    },

    decrementExtraTargetsTurnsRemaining: () => {
        const { extraTargets } = get();

        if (extraTargets.active && extraTargets.turnsRemaining > 0) {
            set({
                extraTargets: {
                    ...extraTargets,
                    turnsRemaining: extraTargets.turnsRemaining - 1,
                },
            });
        } else {
            // Desactivar power-up si se acaba
            set({
                extraTargets: {
                    ...extraTargets,
                    active: false,
                    turnsRemaining: 0,
                },
            });
        }
    },
});