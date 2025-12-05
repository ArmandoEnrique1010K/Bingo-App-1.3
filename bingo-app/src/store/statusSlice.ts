import { StateCreator } from "zustand";
import { Modal } from "../types";
import { NONE_MODAL } from "../constants/statusModalsText";
import { AudioSliceType } from "./audioSlice";
import { CLICK_SOUND } from "../constants/audioSettings";
import { DEFEAT_SOUND } from "../constants/audioSettings";
import { ANYMORE_ENDING } from "../constants/audioSettings";
import { NO_MORE_ROUNDS_MODAL } from "../constants/statusModalsText";
import { RESET_LEVEL_MODAL } from "../constants/statusModalsText";
import { EXIT_MODAL } from "../constants/statusModalsText";

// Slice principal de audio
export type StatusSliceType = {
    modal: Modal;
    isStatusModalOpen: boolean;
    gameEnded: boolean;
    winner: string;
    changeStatusModal: (modal: Modal) => void,
    openStatusModal: () => void,
    closeStatusModal: () => void,
    openResetLevelModal: () => void;
    openExitLevelModal: () => void;
    noMoreRoundModal: () => void;
}

export const statusSlice: StateCreator<StatusSliceType & AudioSliceType, [], [], StatusSliceType> = (set, get) => ({
    modal: NONE_MODAL,
    isStatusModalOpen: false,
    gameEnded: false,
    winner: "",
    changeStatusModal: (modal) => {
        set({
            modal: modal,
            isStatusModalOpen: true
        });
    },

    openStatusModal: () => {
        set({
            isStatusModalOpen: true
        })
        get().playSound(CLICK_SOUND)
    },

    closeStatusModal: () => {
        set({
            isStatusModalOpen: false,
        })
        get().playSound(CLICK_SOUND)
    },

    openResetLevelModal: () => {
        set({
            modal: RESET_LEVEL_MODAL,
            isStatusModalOpen: true
        })
        get().playSound(CLICK_SOUND)
    },

    openExitLevelModal: () => {
        set({
            modal: EXIT_MODAL,
            isStatusModalOpen: true,
        })
        get().playSound(CLICK_SOUND)
    },

    // El juego se termina si no hay más turnos
    noMoreRoundModal: () => {
        set({
            gameEnded: true,
            modal: NO_MORE_ROUNDS_MODAL,
            isStatusModalOpen: true
        })
        get().playSound(DEFEAT_SOUND)
        get().changeMusic(ANYMORE_ENDING)
    },


});