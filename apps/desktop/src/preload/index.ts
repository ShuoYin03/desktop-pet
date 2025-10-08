import { contextBridge } from 'electron';
import type { EngineSnapshot, PetState } from '@desktop-pet/engine';
import { PetEngine } from '@desktop-pet/engine';
import { createSamplePetConfig } from './sampleConfig';

const engine = new PetEngine(createSamplePetConfig());
engine.start();

const api = Object.freeze({
  start: () => engine.start(),
  stop: () => engine.stop(),
  getSnapshot: (): EngineSnapshot => engine.getSnapshot(),
  getAvailableStates: (): PetState[] => engine.getStateNames(),
  setState: (state: PetState): void => engine.setState(state),
  subscribe: (listener: (snapshot: EngineSnapshot) => void): (() => void) => engine.subscribe(listener)
});

contextBridge.exposeInMainWorld('desktopPet', api);
