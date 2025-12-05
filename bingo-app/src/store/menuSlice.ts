
import { StateCreator } from "zustand";
import { AudioSliceType } from "./audioSlice";
import { CLICK_SOUND } from "../constants/audioSettings";
import { LevelSliceType } from "./levelSlice";

export type MenuSliceType = {
    isLoadingGame: boolean
    isMenuLevelsVisible: boolean
    showCreditsModal: boolean,
    showHelpModal: boolean,
    loadedGame: () => void
    showLevelsMenu: () => void;
    openCreditsModal: () => void,
    closeCreditsModal: () => void,
    openHelpModal: () => void,
    closeHelpModal: () => void,
}

// TODO: SEPARAR ESTE MODAL EN 2
// Slice encargado del menu que se muestra al inicio del juego y tambien de los modales de creditos y ayuda
export const menuSlice: StateCreator<MenuSliceType & AudioSliceType & LevelSliceType, [], [], MenuSliceType> = (set, get) => ({
    // Estado de carga del juego y visibilidad del menu
    isLoadingGame: true,
    isMenuLevelsVisible: false,
    // Estado de visibilidad de los modales
    showCreditsModal: false,
    showHelpModal: false,

    // Funcion para cargar el juego
    loadedGame: () => {
        set({ isLoadingGame: false })
    },

    // Funcion para mostrar el menu de niveles
    showLevelsMenu: () => {
        set({ isMenuLevelsVisible: true })
        get().playSound(CLICK_SOUND);
        get().setIsPlayingMusic(true);
        get().changeMusic(get().levelData.music);
    },

    // Funciones para abrir y cerrar los modales, tanto de creditos como de ayuda
    openCreditsModal: () => {
        set({ showCreditsModal: true })
        get().playSound(CLICK_SOUND)

    },
    closeCreditsModal: () => {
        set({ showCreditsModal: false })
        get().playSound(CLICK_SOUND)
    },
    openHelpModal: () => {
        set({ showHelpModal: true })
        get().playSound(CLICK_SOUND)
    },
    closeHelpModal: () => {
        set({ showHelpModal: false })
        get().playSound(CLICK_SOUND)
    },
})
