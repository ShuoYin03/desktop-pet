import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import type { EngineSnapshot, PetState } from '@desktop-pet/engine';

const backgroundStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  margin: 0,
  backgroundColor: 'transparent',
  userSelect: 'none',
  fontFamily: '"Segoe UI", system-ui, sans-serif',
  color: '#2b2d42'
};

const petFrameStyle: React.CSSProperties = {
  width: 160,
  height: 160,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  filter: 'drop-shadow(0 10px 12px rgba(0,0,0,0.25))'
};

const controlsStyle: React.CSSProperties = {
  marginTop: 12,
  padding: 12,
  borderRadius: 12,
  background: 'rgba(255, 255, 255, 0.7)',
  display: 'flex',
  gap: 8,
  flexWrap: 'wrap',
  justifyContent: 'center'
};

const statusBadgeStyle: React.CSSProperties = {
  fontSize: 14,
  padding: '4px 12px',
  borderRadius: 999,
  background: 'rgba(43, 45, 66, 0.8)',
  color: '#fff',
  letterSpacing: 1
};

const buttonStyle: React.CSSProperties = {
  padding: '6px 12px',
  borderRadius: 8,
  background: '#edf2f4',
  border: '1px solid rgba(43, 45, 66, 0.2)',
  cursor: 'pointer',
  fontSize: 14,
  transition: 'transform 0.15s ease, background 0.15s ease'
};

function useEngineSnapshot(): [EngineSnapshot | null, (state: PetState) => void, PetState[]] {
  const [snapshot, setSnapshot] = useState<EngineSnapshot | null>(null);
  const [availableStates, setAvailableStates] = useState<PetState[]>([]);

  useEffect(() => {
    const api = window.desktopPet;
    setSnapshot(api.getSnapshot());
    setAvailableStates(api.getAvailableStates());
    api.start();
    const unsubscribe = api.subscribe((value) => {
      setSnapshot(value);
    });
    return () => {
      unsubscribe();
      api.stop();
    };
  }, []);

  const setState = useCallback((state: PetState) => {
    window.desktopPet.setState(state);
  }, []);

  return [snapshot, setState, availableStates];
}

const App = () => {
  const [snapshot, setState, availableStates] = useEngineSnapshot();
  const lastChaseRequest = useRef(0);

  const handlePointerMove = useCallback(() => {
    const now = performance.now();
    if (now - lastChaseRequest.current > 400) {
      lastChaseRequest.current = now;
      setState('chasing');
    }
  }, [setState]);

  const statusText = useMemo(() => {
    if (!snapshot) {
      return 'loading';
    }
    return `${snapshot.state.toUpperCase()} · frame ${snapshot.frameIndex + 1}`;
  }, [snapshot]);

  return (
    <div
      style={{
        ...backgroundStyle,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onPointerMove={handlePointerMove}
    >
      <div style={petFrameStyle}>
        {snapshot ? (
          <img
            src={snapshot.frame.texturePath}
            width={140}
            height={140}
            alt={`${snapshot.state} frame ${snapshot.frameIndex + 1}`}
            style={{
              width: 140,
              height: 140,
              imageRendering: 'pixelated',
              borderRadius: 28
            }}
          />
        ) : (
          <div style={{ fontSize: 16 }}>Loading pet…</div>
        )}
      </div>

      <div style={statusBadgeStyle}>{statusText}</div>

      {availableStates.length > 0 && (
        <div style={controlsStyle}>
          {availableStates.map((state) => {
            const isActive = snapshot?.state === state;
            return (
              <button
                key={state}
                type="button"
                style={{
                  ...buttonStyle,
                  background: isActive ? '#ffcad4' : buttonStyle.background,
                  transform: isActive ? 'scale(1.05)' : 'scale(1.0)'
                }}
                onClick={() => setState(state)}
              >
                {state}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />);
