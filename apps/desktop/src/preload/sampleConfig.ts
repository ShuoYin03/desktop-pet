import type { AnimationFrame, PetConfig, PetState, StateDefinition } from '@desktop-pet/engine';

interface FrameSpec {
  label: string;
  fill: string;
  accent: string;
  durationMs: number;
}

function createFrame({ label, fill, accent, durationMs }: FrameSpec): AnimationFrame {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
    <rect width="128" height="128" rx="24" fill="${fill}" />
    <circle cx="40" cy="48" r="12" fill="#fff" opacity="0.8" />
    <circle cx="88" cy="48" r="12" fill="#fff" opacity="0.8" />
    <path d="M32 84 Q64 104 96 84" stroke="${accent}" stroke-width="8" stroke-linecap="round" fill="none" />
    <text x="64" y="118" font-family="'Fira Sans', sans-serif" font-size="20" text-anchor="middle" fill="${accent}">${label}</text>
  </svg>`;
  return {
    texturePath: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
    durationMs
  };
}

function buildState(name: PetState, frames: FrameSpec[], transitions: StateDefinition['transitions'] = []): StateDefinition {
  return {
    name,
    frames: frames.map(createFrame),
    transitions
  };
}

export function createSamplePetConfig(): PetConfig {
  const idle: StateDefinition = buildState(
    'idle',
    [
      { label: 'Idle', fill: '#f9dcc4', accent: '#d291bc', durationMs: 500 },
      { label: 'Idle', fill: '#f7b7a3', accent: '#d291bc', durationMs: 500 }
    ],
    [
      { type: 'auto', to: 'sleeping', minDurationMs: 20000 }
    ]
  );

  const chasing: StateDefinition = buildState(
    'chasing',
    [
      { label: 'Pounce!', fill: '#f6bd60', accent: '#ff6b6b', durationMs: 120 },
      { label: 'Pounce!', fill: '#f7a556', accent: '#ff6b6b', durationMs: 120 },
      { label: 'Pounce!', fill: '#f28482', accent: '#ff6b6b', durationMs: 120 }
    ],
    [
      { type: 'auto', to: 'idle', minDurationMs: 2000 }
    ]
  );

  const sleeping: StateDefinition = buildState(
    'sleeping',
    [
      { label: 'Zzz', fill: '#cddafd', accent: '#6c91bf', durationMs: 800 },
      { label: 'Zzz', fill: '#bcd0fb', accent: '#6c91bf', durationMs: 800 }
    ],
    [
      { type: 'auto', to: 'idle', minDurationMs: 10000 }
    ]
  );

  const eating: StateDefinition = buildState(
    'eating',
    [
      { label: 'Nom', fill: '#d8f3dc', accent: '#40916c', durationMs: 300 },
      { label: 'Nom', fill: '#b7e4c7', accent: '#40916c', durationMs: 300 }
    ],
    [
      { type: 'auto', to: 'idle', minDurationMs: 4000 }
    ]
  );

  const playing: StateDefinition = buildState(
    'playing',
    [
      { label: 'Play', fill: '#fff0f3', accent: '#ff758f', durationMs: 200 },
      { label: 'Play', fill: '#ffe5ec', accent: '#ff758f', durationMs: 200 },
      { label: 'Play', fill: '#ffc2d1', accent: '#ff758f', durationMs: 200 }
    ],
    [
      { type: 'auto', to: 'idle', minDurationMs: 3500 }
    ]
  );

  const purring: StateDefinition = buildState(
    'purring',
    [
      { label: 'Purr', fill: '#f1f0ff', accent: '#9381ff', durationMs: 250 },
      { label: 'Purr', fill: '#dcd9ff', accent: '#9381ff', durationMs: 250 }
    ],
    [
      { type: 'auto', to: 'idle', minDurationMs: 3000 }
    ]
  );

  const states: StateDefinition[] = [idle, chasing, sleeping, eating, playing, purring];

  return {
    states,
    initialState: 'idle'
  };
}
