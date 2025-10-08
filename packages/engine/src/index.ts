export type PetState = 'idle' | 'chasing' | 'sleeping' | 'eating' | 'playing' | 'purring';

export interface AnimationFrame {
  texturePath: string;
  durationMs: number;
}

export interface StateDefinition {
  name: PetState;
  frames: AnimationFrame[];
}

export interface PetConfig {
  states: StateDefinition[];
}

export class PetEngine {
  private readonly config: PetConfig;

  constructor(config: PetConfig) {
    this.config = config;
  }

  getStateNames(): PetState[] {
    return this.config.states.map((state) => state.name);
  }
}
