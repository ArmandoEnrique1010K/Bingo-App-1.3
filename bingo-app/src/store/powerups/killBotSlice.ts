import { StateCreator } from "zustand";
import { DetailsPowerUp } from "../../types";
import { BotSliceType } from "../botSlice";

export type KillBotSliceType = {
    // Eliminar un bot del nivel permanentemente
    killBot: DetailsPowerUp;
    activateKillBot: () => void;
    killBotOnBotClick: (
        botName: string,
    ) => void;
    killedBotName: string;
}

// Slice para el powerup de ralentizar bots
export const killBotSlice: StateCreator<KillBotSliceType & BotSliceType, [], [], KillBotSliceType> = (set, get) => ({
    killBot: {
        type: 'oneTime',
        hasActivated: false,
        active: false,
        turnsRemaining: 0,
    },



    activateKillBot: () => {
        set({
            killBot: {
                ...get().killBot,
                active: true,
                turnsRemaining: 1,
            },
        });
    },
    killedBotName: '',

    killBotOnBotClick: (botName: string) => {
        const { killBot } = get();
        if (!killBot.active) return;

        // TODO: AQUI DEBE ESTAR EL POWERUP DE ELIMINAR UN BOT
        // console.log(`El bot ${botName} ha sido eliminado`);

        // Logica de eliminación de bots
        const bot = get().botBoards.filter((bot) => bot.name !== botName);
        if (!bot) return;

        set(() => ({
            botBoards: bot,
        }));

        // Desactivar power-up
        set({
            killBot: {
                ...killBot,
                active: false,
                hasActivated: true,
                turnsRemaining: 0,
            },
            killedBotName: botName,
        });
    },

});