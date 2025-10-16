import type {
  AnimationFrame,
  PetConfig,
  PetState,
  StateDefinition
} from '@desktop-pet/engine';

interface SpriteOptions {
  blink?: boolean;
  bounce?: number;
  pawsForward?: boolean;
  holdSeed?: boolean;
  cheeksPuffed?: boolean;
  sleepBubble?: boolean;
  sparkles?: boolean;
  motionTrail?: boolean;
  playToy?: boolean;
  tailTilt?: number;
  heart?: boolean;
}

interface FrameSpec {
  state: PetState;
  durationMs: number;
  sprite: SpriteOptions;
}

function svgToDataUri(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function createHamsterSprite(options: SpriteOptions = {}): string {
  const {
    blink = false,
    bounce = 0,
    pawsForward = false,
    holdSeed = false,
    cheeksPuffed = false,
    sleepBubble = false,
    sparkles = false,
    motionTrail = false,
    playToy = false,
    tailTilt = 0,
    heart = false
  } = options;

  const cheeks = cheeksPuffed
    ? `<ellipse cx="23" cy="36" rx="4.6" ry="3.4" fill="#F4A6AE" opacity="0.9" />
       <ellipse cx="41" cy="36" rx="4.6" ry="3.4" fill="#F4A6AE" opacity="0.9" />`
    : `<circle cx="23" cy="36" r="3.2" fill="#F4A6AE" opacity="0.8" />
       <circle cx="41" cy="36" r="3.2" fill="#F4A6AE" opacity="0.8" />`;

  const eyes = blink
    ? `<rect x="23.8" y="29.5" width="5" height="1.6" rx="0.8" fill="#2F1B12" />
       <rect x="35.2" y="29.5" width="5" height="1.6" rx="0.8" fill="#2F1B12" />`
    : `<circle cx="26.4" cy="29.8" r="2.3" fill="#2F1B12" />
       <circle cx="37.6" cy="29.8" r="2.3" fill="#2F1B12" />
       <circle cx="25.7" cy="29.2" r="0.7" fill="#FFFFFF" opacity="0.9" />
       <circle cx="36.9" cy="29.2" r="0.7" fill="#FFFFFF" opacity="0.9" />`;

  const paws = pawsForward
    ? `<rect x="21" y="43" width="8" height="6" rx="3" fill="#F4CDB3" stroke="#2F1B12" stroke-width="0.8" />
       <rect x="35" y="43" width="8" height="6" rx="3" fill="#F4CDB3" stroke="#2F1B12" stroke-width="0.8" />`
    : `<rect x="22" y="46" width="7" height="5" rx="2.5" fill="#F4CDB3" stroke="#2F1B12" stroke-width="0.8" />
       <rect x="35" y="46" width="7" height="5" rx="2.5" fill="#F4CDB3" stroke="#2F1B12" stroke-width="0.8" />`;

  const seed = holdSeed
    ? `<ellipse cx="32" cy="45" rx="5.2" ry="3.2" fill="#E3B94F" stroke="#B7791F" stroke-width="1" />
       <ellipse cx="33.4" cy="43.8" rx="1.4" ry="0.9" fill="#FDF3C4" opacity="0.7" />`
    : '';

  const bubble = sleepBubble
    ? `<g opacity="0.8">
         <ellipse cx="51" cy="18" rx="5" ry="6.5" fill="#CBE7FF" />
         <ellipse cx="55.5" cy="10.5" rx="2.6" ry="3.2" fill="#D9F1FF" />
         <circle cx="57.8" cy="6.5" r="1.4" fill="#E8F7FF" />
       </g>`
    : '';

  const sparklesGroup = sparkles
    ? `<g fill="#FBD38D" stroke="#D69E2E" stroke-width="0.6">
         <polygon points="12,10 14,14 12,18 10,14" />
         <polygon points="54,14 56,18 54,22 52,18" />
         <polygon points="14,22 16,26 14,30 12,26" />
       </g>`
    : '';

  const motion = motionTrail
    ? `<path d="M12 38 q -8 -10 6 -16" fill="none" stroke="#94A3B8" stroke-width="2" stroke-linecap="round" />
       <path d="M16 46 q -6 -6 4 -14" fill="none" stroke="#CBD5F5" stroke-width="1.4" stroke-linecap="round" />`
    : '';

  const toy = playToy
    ? `<g>
         <circle cx="54" cy="48" r="6" fill="#60A5FA" stroke="#1E40AF" stroke-width="1.2" />
         <path d="M50 45 q 4 3 8 0" stroke="#BFDBFE" stroke-width="1.2" fill="none" />
       </g>`
    : '';

  const heartGroup = heart
    ? `<path d="M14 28 q 4 -6 8 0 q -4 5 -8 8 q -4 -3 -8 -8 q 4 -6 8 0" fill="#F56565" stroke="#C53030" stroke-width="0.8" />`
    : '';

  const tail = `<path d="M48 36 q 10 ${-4 + tailTilt} 8 14" fill="none" stroke="#2F1B12" stroke-width="3" stroke-linecap="round" />`;

  const whiskers = `<path d="M18 36 q -8 -2 -12 -4" stroke="#2F1B12" stroke-width="1" stroke-linecap="round" />
                     <path d="M18 39 q -8 0 -12 2" stroke="#2F1B12" stroke-width="1" stroke-linecap="round" />
                     <path d="M46 36 q 8 -2 12 -4" stroke="#2F1B12" stroke-width="1" stroke-linecap="round" />
                     <path d="M46 39 q 8 0 12 2" stroke="#2F1B12" stroke-width="1" stroke-linecap="round" />`;

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" shape-rendering="crispEdges">
      ${motion}
      ${sparklesGroup}
      ${heartGroup}
      ${toy}
      <g transform="translate(0 ${bounce})">
        ${bubble}
        ${tail}
        <g>
          <circle cx="20" cy="16" r="6" fill="#F4CDB3" stroke="#2F1B12" stroke-width="1" />
          <circle cx="44" cy="16" r="6" fill="#F4CDB3" stroke="#2F1B12" stroke-width="1" />
          <circle cx="20" cy="16" r="3.5" fill="#FAD9C3" />
          <circle cx="44" cy="16" r="3.5" fill="#FAD9C3" />
        </g>
        <ellipse cx="32" cy="34" rx="18" ry="20" fill="#F2B694" stroke="#2F1B12" stroke-width="1.4" />
        <ellipse cx="32" cy="39" rx="12" ry="14" fill="#FBE7D3" />
        ${cheeks}
        ${eyes}
        <path d="M30 35 q 2 2 4 0" stroke="#2F1B12" stroke-width="1.2" stroke-linecap="round" fill="none" />
        <path d="M30 37 q 2 2 4 2" stroke="#2F1B12" stroke-width="1.2" stroke-linecap="round" fill="none" />
        ${paws}
        ${seed}
        ${whiskers}
      </g>
    </svg>
  `;
}

function createFrame({ state, durationMs, sprite }: FrameSpec): AnimationFrame {
  return {
    texturePath: svgToDataUri(createHamsterSprite(sprite)),
    durationMs
  };
}

function buildState(
  name: PetState,
  frames: FrameSpec[],
  transitions: StateDefinition['transitions'] = []
): StateDefinition {
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
      { state: 'idle', durationMs: 450, sprite: { tailTilt: -1 } },
      { state: 'idle', durationMs: 450, sprite: { blink: true, tailTilt: 2 } }
    ],
    [{ type: 'auto', to: 'sleeping', minDurationMs: 20000 }]
  );

  const chasing: StateDefinition = buildState(
    'chasing',
    [
      { state: 'chasing', durationMs: 140, sprite: { bounce: -2, motionTrail: true, tailTilt: -2 } },
      { state: 'chasing', durationMs: 140, sprite: { bounce: 0, pawsForward: true, motionTrail: true } },
      { state: 'chasing', durationMs: 140, sprite: { bounce: -2, motionTrail: true, tailTilt: 2 } }
    ],
    [{ type: 'auto', to: 'idle', minDurationMs: 2000 }]
  );

  const sleeping: StateDefinition = buildState(
    'sleeping',
    [
      { state: 'sleeping', durationMs: 850, sprite: { blink: true, sleepBubble: true, tailTilt: 4 } },
      { state: 'sleeping', durationMs: 850, sprite: { blink: true, sleepBubble: true, tailTilt: 0, bounce: -1 } }
    ],
    [{ type: 'auto', to: 'idle', minDurationMs: 10000 }]
  );

  const eating: StateDefinition = buildState(
    'eating',
    [
      { state: 'eating', durationMs: 320, sprite: { holdSeed: true, cheeksPuffed: false, pawsForward: true } },
      { state: 'eating', durationMs: 320, sprite: { holdSeed: true, cheeksPuffed: true, pawsForward: true } }
    ],
    [{ type: 'auto', to: 'idle', minDurationMs: 4000 }]
  );

  const playing: StateDefinition = buildState(
    'playing',
    [
      { state: 'playing', durationMs: 220, sprite: { playToy: true, bounce: -2, tailTilt: -2 } },
      { state: 'playing', durationMs: 220, sprite: { playToy: true, bounce: 0, pawsForward: true } },
      { state: 'playing', durationMs: 220, sprite: { playToy: true, bounce: -2, tailTilt: 3 } }
    ],
    [{ type: 'auto', to: 'idle', minDurationMs: 3500 }]
  );

  const purring: StateDefinition = buildState(
    'purring',
    [
      { state: 'purring', durationMs: 260, sprite: { sparkles: true, heart: true, tailTilt: -2 } },
      { state: 'purring', durationMs: 260, sprite: { sparkles: true, heart: true, blink: true, tailTilt: 2 } }
    ],
    [{ type: 'auto', to: 'idle', minDurationMs: 3000 }]
  );

  return {
    states: [idle, chasing, sleeping, eating, playing, purring],
    initialState: 'idle'
  };
}
