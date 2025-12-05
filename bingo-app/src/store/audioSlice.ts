import { StateCreator } from "zustand";
import * as Tone from 'tone'
import { LevelSliceType } from "./levelSlice";
import { Audio } from "../types";
import { preloadedMusicPlayersMap } from "../utils/Audio/preloadMusicFiles";
import { preloadedSoundPlayersMap } from "../utils/Audio/preloadSoundFiles";

// Slice principal de audio
export type AudioSliceType = {
  isPlayingMusic: boolean,
  isPlayingSound: boolean,
  player: Tone.Player,
  startMusic: (music: Audio) => void;
  stopMusic: () => void,
  playSound: (sound: Audio) => void;
  changeMusic: (music: Audio) => void;
  setIsPlayingMusic: (value: boolean) => void;
  setIsPlayingSound: (value: boolean) => void;
}

export const audioSlice: StateCreator<AudioSliceType & LevelSliceType, [], [], AudioSliceType> = (set, get) => ({
  isPlayingMusic: false,
  isPlayingSound: true,
  player: new Tone.Player(),

  startMusic: (music: Audio) => {
    const player = preloadedMusicPlayersMap.get(music.name);
    if (player && get().isPlayingMusic) {
      player.autostart = true
      player.loop = true
      player.volume.value = music.volume;
      player.start();

      set({
        player: player,
      });
    }
  },

  stopMusic: () => {
    get().player.stop();
  },

  playSound: (sound: Audio) => {
    const player = preloadedSoundPlayersMap.get(sound.name);
    player?.stop()

    if (player && get().isPlayingSound) {
      player.autostart = true
      player.volume.value = sound.volume;
      player.start()
    }
  },

  changeMusic: (music: Audio) => {
    get().stopMusic()
    get().startMusic(music)
  },

  setIsPlayingMusic: (value: boolean) => {
    set({ isPlayingMusic: value });
  },

  setIsPlayingSound: (value: boolean) => {
    set({ isPlayingSound: value });
  }
});