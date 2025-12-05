import { StateCreator } from "zustand";
import { DetailsPowerUp } from "../../types";

export type SlowBotsSliceType = {
    slowBots: DetailsPowerUp;
    activateSlowBots: () => void;
    decrementSlowBotsTurnsRemaining: () => void;
}

// Slice para el powerup de ralentizar bots
export const slowBotsSlice: StateCreator<SlowBotsSliceType, [], [], SlowBotsSliceType> = (set, get) => ({
    slowBots: {
        type: 'continuous',
        hasActivated: false,
        active: false,
        turnsRemaining: 0,
    },

    // Ralentizar bots
    activateSlowBots: () => {
        set((state) => ({
            slowBots: {
                ...state.slowBots,
                hasActivated: true,
                active: true,
                turnsRemaining: 5,
            },
        }));
    },

    decrementSlowBotsTurnsRemaining: () => {
        const { slowBots } = get();
        if (slowBots.active && slowBots.turnsRemaining > 0) {
            set((state) => ({
                slowBots: {
                    ...state.slowBots,
                    turnsRemaining: state.slowBots.turnsRemaining - 1,
                },
            }));
        } else {
            set((state) => ({
                slowBots: {
                    ...state.slowBots,
                    active: false,
                    turnsRemaining: 0,
                },
            }));
        }
    },
});