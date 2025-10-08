export type PetState = 'idle' | 'chasing' | 'sleeping' | 'eating' | 'playing' | 'purring';

export interface AnimationFrame {
  /** Fully qualified path or data URI pointing to the rendered frame texture. */
  texturePath: string;
  /** Amount of time (in milliseconds) this frame should stay on screen. */
  durationMs: number;
}

export interface StateTransition {
  /** Whether the transition happens automatically or must be triggered manually. */
  type: 'auto' | 'manual';
  /** The target state. */
  to: PetState;
  /** Minimum amount of time (in milliseconds) the current state must run before the transition can occur. */
  minDurationMs?: number;
}

export interface StateDefinition {
  name: PetState;
  frames: AnimationFrame[];
  transitions?: StateTransition[];
}

export interface PetConfig {
  states: StateDefinition[];
  /** Optional override for the state the pet should start in. Defaults to the first state. */
  initialState?: PetState;
}

export interface EngineSnapshot {
  state: PetState;
  frame: AnimationFrame;
  frameIndex: number;
  /** How long the current frame has been displayed. */
  frameElapsedMs: number;
  /** How long we have been in the current state. */
  stateElapsedMs: number;
  /** Number of times the current state has looped through all of its frames. */
  loopCount: number;
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

export class PetEngine {
  private readonly stateMap: Map<PetState, StateDefinition>;
  private readonly config: PetConfig;
  private currentState: StateDefinition;
  private currentFrameIndex = 0;
  private stateStartedAt = Date.now();
  private frameStartedAt = Date.now();
  private loopCount = 0;
  private ticker: ReturnType<typeof setInterval> | null = null;
  private readonly listeners = new Set<(snapshot: EngineSnapshot) => void>();

  constructor(config: PetConfig) {
    assert(config.states.length > 0, 'Pet config must provide at least one state.');

    this.config = config;
    this.stateMap = new Map();
    for (const state of config.states) {
      assert(state.frames.length > 0, `State "${state.name}" must define at least one frame.`);
      if (this.stateMap.has(state.name)) {
        throw new Error(`Duplicate state definition for "${state.name}".`);
      }
      this.stateMap.set(state.name, state);
    }

    const initialStateName = config.initialState ?? config.states[0]!.name;
    const initialState = this.stateMap.get(initialStateName);
    assert(initialState, `Initial state "${initialStateName}" is not part of the provided configuration.`);
    this.currentState = initialState;
  }

  /** Start the internal update loop. Subsequent calls are ignored. */
  start(): void {
    if (this.ticker) {
      return;
    }

    this.stateStartedAt = Date.now();
    this.frameStartedAt = this.stateStartedAt;
    this.emitSnapshot();
    this.ticker = setInterval(() => this.tick(), 16);
  }

  /** Stop the internal update loop. */
  stop(): void {
    if (this.ticker) {
      clearInterval(this.ticker);
      this.ticker = null;
    }
  }

  /** Dispose the engine and stop notifying listeners. */
  dispose(): void {
    this.stop();
    this.listeners.clear();
  }

  private tick(): void {
    const now = Date.now();
    this.advanceFrame(now);
    this.evaluateAutoTransitions(now);
    this.emitSnapshot(now);
  }

  private advanceFrame(now: number): void {
    const currentFrame = this.currentState.frames[this.currentFrameIndex]!;
    const elapsed = now - this.frameStartedAt;
    if (elapsed >= currentFrame.durationMs) {
      const looped = this.currentFrameIndex === this.currentState.frames.length - 1;
      this.currentFrameIndex = (this.currentFrameIndex + 1) % this.currentState.frames.length;
      this.frameStartedAt = now;
      if (looped) {
        this.loopCount += 1;
      }
    }
  }

  private evaluateAutoTransitions(now: number): void {
    const transitions = this.currentState.transitions?.filter((transition) => transition.type === 'auto');
    if (!transitions || transitions.length === 0) {
      return;
    }

    for (const transition of transitions) {
      const minDuration = transition.minDurationMs ?? 0;
      if (now - this.stateStartedAt >= minDuration) {
        this.transitionTo(transition.to, now);
        break;
      }
    }
  }

  /**
   * Force the engine into a specific state, resetting the animation frame index.
   */
  setState(state: PetState): void {
    this.transitionTo(state, Date.now());
    this.emitSnapshot();
  }

  private transitionTo(target: PetState, now: number): void {
    const nextState = this.stateMap.get(target);
    assert(nextState, `Attempted to transition to unknown state "${target}".`);

    if (nextState === this.currentState) {
      return;
    }

    this.currentState = nextState;
    this.currentFrameIndex = 0;
    this.stateStartedAt = now;
    this.frameStartedAt = now;
    this.loopCount = 0;
  }

  getStateNames(): PetState[] {
    return Array.from(this.stateMap.keys());
  }

  getSnapshot(): EngineSnapshot {
    return this.buildSnapshot(Date.now());
  }

  subscribe(listener: (snapshot: EngineSnapshot) => void): () => void {
    this.listeners.add(listener);
    listener(this.getSnapshot());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private buildSnapshot(now: number): EngineSnapshot {
    const currentFrame = this.currentState.frames[this.currentFrameIndex]!;
    return Object.freeze({
      state: this.currentState.name,
      frame: currentFrame,
      frameIndex: this.currentFrameIndex,
      frameElapsedMs: now - this.frameStartedAt,
      stateElapsedMs: now - this.stateStartedAt,
      loopCount: this.loopCount
    });
  }

  private emitSnapshot(now = Date.now()): void {
    if (this.listeners.size === 0) {
      return;
    }
    const snapshot = this.buildSnapshot(now);
    for (const listener of this.listeners) {
      listener(snapshot);
    }
  }
}
