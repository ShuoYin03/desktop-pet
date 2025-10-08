import type { EngineSnapshot, PetState } from '@desktop-pet/engine';

export {}; // ensure this file is treated as a module

declare global {
  interface Window {
    desktopPet: {
      start: () => void;
      stop: () => void;
      getSnapshot: () => EngineSnapshot;
      getAvailableStates: () => PetState[];
      setState: (state: PetState) => void;
      subscribe: (listener: (snapshot: EngineSnapshot) => void) => () => void;
    };
  }
}
